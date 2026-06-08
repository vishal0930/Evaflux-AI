import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/followup
router.post('/', async (req, res) => {
  const { originalInquiry, currentSituation, buyerCountry, channel } = req.body;

  // ── Validation ───────────────────────────────────────────
  if (!originalInquiry || !currentSituation || !buyerCountry || !channel) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['originalInquiry', 'currentSituation', 'buyerCountry', 'channel'],
    });
  }

  if (!['Email', 'WhatsApp'].includes(channel)) {
    return res.status(400).json({ error: 'channel must be either "Email" or "WhatsApp"' });
  }

  // ── Prompt Engineering ───────────────────────────────────
  const systemPrompt = `You are an expert B2B sales communication specialist for an industrial automation company that sells components like PLCs, HMIs, servo drives, sensors, and automation parts globally.

Your task is to write professional follow-up messages to buyers who have gone silent after receiving a quotation.

Guidelines:
- Tone: Professional, warm, non-pushy, helpful
- Show genuine interest in solving the buyer's problem
- Reference the specific product they inquired about
- Keep it concise (3-5 short paragraphs for Email, 3-5 sentences for WhatsApp)
- For WhatsApp: casual but professional, use line breaks, no formal subject line
- For Email: include a subject line on the first line starting with "Subject: ", then the body
- End with a clear but soft call to action
- Adapt tone slightly based on the buyer's country/culture (e.g. more formal for Germany, warmer for Middle East)
- Output ONLY the message text — no explanations, no commentary, no markdown`;

  const userPrompt = `Write a ${channel} follow-up message for this situation:

BUYER'S ORIGINAL INQUIRY:
${originalInquiry}

CURRENT SITUATION:
${currentSituation}

BUYER'S COUNTRY: ${buyerCountry}
CHANNEL: ${channel}

Generate the follow-up message now:`;

  // ── Call Mistral API ──────────────────────────────────────
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-large-latest',
        max_tokens: 1024,
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

    const message = response.data.choices[0].message.content.trim();
    return res.json({ success: true, message, channel });

  } catch (err) {
    console.error('Mistral API error:', err.response?.data || err.message);

    if (err.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid Mistral API key. Check your .env file.' });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timed out. Please try again.' });
    }

    return res.status(500).json({
      error: 'Failed to generate follow-up message',
      detail: err.response?.data?.error?.message || err.message,
    });
  }
});

export default router;