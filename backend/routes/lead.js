import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientsFilePath = path.join(__dirname, '../data/clients.json');

const router = express.Router();

// Helper to load clients
const getClients = () => {
  try {
    const data = fs.readFileSync(clientsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading clients file:', err);
    return [];
  }
};

// GET /api/leads/clients - Get the 20 client profiles
router.get('/clients', (req, res) => {
  const clients = getClients();
  res.json({ success: true, clients });
});

// POST /api/leads/evaluate - Score the lead and generate followups
router.post('/evaluate', async (req, res) => {
  const {
    geography,
    partType,
    targetPrice,
    partAvailability,
    communicationChannel,
    responseSpeed,
    followupsSent,
    daysSinceLastReply
  } = req.body;

  // ── Validation ───────────────────────────────────────────
  if (!geography || !partType || targetPrice === undefined || !partAvailability || !communicationChannel || !responseSpeed || followupsSent === undefined || daysSinceLastReply === undefined) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: [
        'geography',
        'partType',
        'targetPrice',
        'partAvailability',
        'communicationChannel',
        'responseSpeed',
        'followupsSent',
        'daysSinceLastReply'
      ],
    });
  }

  const clients = getClients();
  let matchedClient = null;
  let priceDiffPercent = null;
  let budgetMatchPoints = 10; // Default baseline score for budget match
  let priceMismatch = false;

  // Convert input price to number
  const inputPrice = parseFloat(targetPrice);

  // ── Step 1: Matching Logic against 20 Clients ────────────
  for (const client of clients) {
    const countryMatch = client.country.toLowerCase().includes(geography.trim().toLowerCase()) || 
                         geography.trim().toLowerCase().includes(client.country.toLowerCase());
                         
    const productMatch = client.productName.toLowerCase().includes(partType.trim().toLowerCase()) || 
                         partType.trim().toLowerCase().includes(client.productName.toLowerCase());

    if (countryMatch && productMatch) {
      matchedClient = client;
      priceDiffPercent = Math.abs(inputPrice - client.targetPrice) / client.targetPrice;
      break;
    }
  }

  // ── Step 2: Scoring Heuristic (0-100) ────────────────────
  // 1. Part Availability (Max 20 pts)
  let availabilityPoints = 0;
  if (partAvailability === 'In Stock') availabilityPoints = 20;
  else if (partAvailability === 'Limited') availabilityPoints = 12;
  else if (partAvailability === 'Out of Stock') availabilityPoints = 0;

  // 2. Response Speed (Max 20 pts)
  let speedPoints = 0;
  if (responseSpeed === 'Immediate') speedPoints = 20;
  else if (responseSpeed === 'Within 24 Hours') speedPoints = 12;
  else if (responseSpeed === 'Delayed') speedPoints = 4;

  // 3. Days Since Last Reply (Max 20 pts)
  let recencyPoints = 0;
  const days = parseInt(daysSinceLastReply, 10);
  if (days <= 2) recencyPoints = 20;
  else if (days <= 5) recencyPoints = 15;
  else if (days <= 10) recencyPoints = 8;
  else recencyPoints = 0;

  // 4. Follow-ups Sent (Max 15 pts)
  let followupsPoints = 0;
  const sentCount = parseInt(followupsSent, 10);
  if (sentCount === 0) followupsPoints = 10;
  else if (sentCount === 1 || sentCount === 2) followupsPoints = 15;
  else if (sentCount === 3) followupsPoints = 8;
  else followupsPoints = 2; // Too many follow-ups without response decreases probability

  // 5. Budget Match Points (Max 25 pts)
  if (matchedClient) {
    if (priceDiffPercent <= 0.05) {
      budgetMatchPoints = 25; // Perfect match
    } else if (priceDiffPercent <= 0.15) {
      budgetMatchPoints = 20; // High match
    } else if (priceDiffPercent <= 0.25) {
      budgetMatchPoints = 15; // Moderate match
    } else {
      budgetMatchPoints = -20; // Major price mismatch penalty!
      priceMismatch = true;
    }
  } else {
    // No direct database client match, score based on simple heuristics
    budgetMatchPoints = 10;
  }

  const rawScore = availabilityPoints + speedPoints + recencyPoints + followupsPoints + budgetMatchPoints;
  const leadScore = Math.max(0, Math.min(100, rawScore));

  // Conversion Probability Class
  let conversionProbability = 'Low';
  if (leadScore >= 75) {
    conversionProbability = 'High';
  } else if (leadScore >= 40) {
    conversionProbability = 'Medium';
  }

  // ── Step 3: Call Mistral API to generate Day 2, 5, 10 messages ──
  const channelText = communicationChannel === 'WhatsApp' ? 'WhatsApp' : 'Email';
  const matchInfoText = matchedClient 
    ? `The buyer matches client profile "${matchedClient.name}" who is looking for "${matchedClient.productName}" in "${matchedClient.country}" with a target price of $${matchedClient.targetPrice}.`
    : `The buyer is in "${geography}", looking for product "${partType}" at a target price of $${targetPrice}.`;

  const systemPrompt = `You are an expert B2B sales copywriter specializing in industrial automation components globally.
Your task is to write three personalized follow-up messages (Day 2, Day 5, and Day 10) to a buyer who has gone silent after receiving a quotation.
The follow-up messages must be tailored to the buyer's geography and product/part requirements.

Guidelines:
- Day 2 Follow-up: A gentle check-in. Ask if they received the quotation or have any initial questions. Keep it brief.
- Day 5 Follow-up: Value-added follow-up. Share a technical insight or offer support/documentation regarding the specific parts.
- Day 10 Follow-up: A final, polite break-up or check-in to see if the project is postponed or if they need to close the file.
- Channel specific style:
  - For Email: Provide a clear "Subject: [subject]" line and Body.
  - For WhatsApp: Keep it short, conversational, use line breaks, NO email headings or subject lines.
- Cultural/Geographical tailoring: Adapt the politeness, greeting style, and tone to the specified country (e.g. more structured/formal for Germany, warmer/personal for Middle East, etc.).

You must respond ONLY with a valid JSON object in this format (no markdown code blocks, no additional explanation, do not wrap in \`\`\`json):
{
  "day2": "Day 2 follow up text goes here",
  "day5": "Day 5 follow up text goes here",
  "day10": "Day 10 follow up text goes here"
}`;

  const userPrompt = `Write the Day 2, Day 5, and Day 10 follow-up messages for a ${channelText} channel:
- Buyer Location: ${geography}
- Product: ${partType}
- Target Price: $${targetPrice}
- Context: ${matchInfoText}
- Conversion Probability: ${conversionProbability} (Score: ${leadScore}/100)

Generate the 3 follow-ups now in JSON format.`;

  let followups = {
    day2: `Hello, following up on your inquiry for ${partType}. Let me know if you have any questions.`,
    day5: `Hi, wanted to share the technical specifications for ${partType}. Let me know if we can proceed.`,
    day10: `Hi, following up a final time on ${partType}. Let us know if this project is still active.`
  };
  let aiGenerationStatus = 'fallback';
  let aiErrorDetail = null;

  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-large-latest',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'content-type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const rawText = response.data.choices[0].message.content.trim();
    
    // Parse JSON safely
    try {
      const clean = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (parsed.day2 && parsed.day5 && parsed.day10) {
        followups = parsed;
        aiGenerationStatus = 'success';
      }
    } catch (parseErr) {
      console.warn('Failed to parse Mistral response as JSON:', rawText);
      aiGenerationStatus = 'failed_parse';
      aiErrorDetail = 'AI returned non-JSON format';
    }
  } catch (err) {
    console.error('Mistral API error in lead scorer:', err.response?.data || err.message);
    aiGenerationStatus = 'api_error';
    aiErrorDetail = err.response?.data?.error?.message || err.message;
  }

  res.json({
    success: true,
    leadScore,
    conversionProbability,
    priceMismatch,
    scoreBreakdown: {
      availability: availabilityPoints,
      responseSpeed: speedPoints,
      daysSinceLastReply: recencyPoints,
      followupsSent: followupsPoints,
      budgetMatch: budgetMatchPoints
    },
    matchedClient,
    followups,
    aiGenerationStatus,
    aiErrorDetail
  });
});

export default router;
