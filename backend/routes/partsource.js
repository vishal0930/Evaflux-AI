import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/partsource
router.post('/', async (req, res) => {
  const { partNumber, manufacturer, productType, additionalContext } = req.body;

  // ── Validation ───────────────────────────────────────────
  if (!partNumber || !manufacturer) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['partNumber', 'manufacturer'],
    });
  }

  // ── Step 1: Tavily Web Search ────────────────────────────
  let searchResults = [];
  let searchError = null;

  try {
    const tavilyQuery = `${partNumber} ${manufacturer} ${productType || ''} supplier distributor buy stock availability`.trim();

    const tavilyResponse = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: process.env.TAVILY_API_KEY,
        query: tavilyQuery,
        search_depth: 'advanced',
        max_results: 8,
        include_answer: false,
        include_raw_content: false,
        include_domains: [
          'mroeelectric.com', 'plcdirect.com', 'automation24.com',
          'ebay.com', 'amazon.com', 'automation.com', 'directindustry.com',
          'factory-automation.com', 'dfliq.net', 'eu-automation.com',
          'surplus-city.com', 'mcmaster.com', 'grainger.com',
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000,
      }
    );

    searchResults = tavilyResponse.data.results || [];

  } catch (err) {
    console.warn('Tavily search failed:', err.response?.data || err.message);
    const detailMsg = err.response?.data ? (typeof err.response.data === 'object' ? JSON.stringify(err.response.data) : err.response.data) : null;
    searchError = detailMsg || err.message || 'Web search unavailable';
  }

  // ── Step 2: Build Claude Prompt ──────────────────────────
  const searchContext = searchResults.length > 0
    ? searchResults.map((r, i) =>
        `[Result ${i + 1}]
Title: ${r.title}
URL: ${r.url}
Snippet: ${r.content?.slice(0, 300) || 'No description'}
`).join('\n')
    : 'No web search results available.';

  const systemPrompt = `You are an expert industrial automation parts sourcing specialist. 
Your job is to analyze web search results and provide structured sourcing information for industrial parts.
Always respond with a valid JSON object — no markdown, no extra text, just raw JSON.`;

  const userPrompt = `Find supplier information for this industrial automation part:

PART NUMBER: ${partNumber}
MANUFACTURER: ${manufacturer}
PRODUCT TYPE: ${productType || 'Not specified'}
ADDITIONAL CONTEXT: ${additionalContext || 'None'}

WEB SEARCH RESULTS:
${searchContext}

Return a JSON object with this exact structure:
{
  "suppliers": [
    {
      "name": "Supplier company name",
      "url": "https://full-url-to-product-or-supplier",
      "availability": "In Stock | Limited | Out of Stock | Unknown",
      "notes": "Any relevant notes about this supplier"
    }
  ],
  "alternativeParts": [
    {
      "partNumber": "ALT-PART-123",
      "description": "Why this is an alternative"
    }
  ],
  "summary": "2-3 sentence summary about this part's availability, common suppliers, and sourcing advice",
  "partInfo": "Brief description of what this part is and its application"
}

Rules:
- Include up to 5 suppliers from the search results. Only include real URLs from the search results.
- If no real suppliers found, return empty suppliers array
- Suggest 1-3 alternative part numbers if you know them from your knowledge
- If search failed or had no results, still provide partInfo and alternativeParts from your training knowledge
- Keep the summary practical and actionable`;

  // ── Step 3: Call Mistral API ─────────────────────────────
  try {
    const mistralResponse = await axios.post(
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

    const rawText = mistralResponse.data.choices[0].message.content.trim();

    // Parse JSON safely
    let parsed;
    try {
      // Strip markdown code fences if present
      const clean = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        suppliers: [],
        alternativeParts: [],
        summary: rawText,
        partInfo: `Part ${partNumber} by ${manufacturer}`,
      };
    }

    return res.json({
      success: true,
      partNumber,
      manufacturer,
      searchResultsCount: searchResults.length,
      searchError: searchError || null,
      rawLinks: searchResults.map(r => ({ title: r.title, url: r.url })),
      ...parsed,
    });

  } catch (err) {
    console.error('Mistral API error:', err.response?.data || err.message);

    if (err.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid Mistral API key. Check your .env file.' });
    }

    return res.status(500).json({
      error: 'Failed to process part sourcing request',
      detail: err.response?.data?.error?.message || err.message,
      searchResults: searchResults.length,
    });
  }
});

export default router;