const express = require('express');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API
});

// API endpoint for AI assessment
app.post('/api/ai-assessment', async (req, res) => {
  try {
    const { channelMix, metrics } = req.body;

    const systemPrompt = `You are an expert media strategist analyzing a channel mix for a Disney Darlings toy launch campaign in Europe (UK, Germany, France).

Key context:
- Product: Disney "Darlings" dolls at €45-55 price point
- Target: European parents of girls 3-7 years old
- Strategy: "Real Reactions" - using authentic unboxing videos to build trust
- Insight: European parents buy on evidence, not just advertising
- Higher conversion channels: Retail DSP (1.8x), Creators (1.5x)
- Lower efficiency channels: TikTok (0.9x), OOH (0.8x)

Analyze the channel allocation and provide strategic recommendations in JSON format.`;

    const userPrompt = `Current channel mix:
${Object.entries(channelMix).map(([ch, val]) => `- ${ch}: ${(val * 100).toFixed(1)}%`).join('\n')}

Projected metrics:
- Impressions: ${metrics?.impressions?.toLocaleString() || 'N/A'}
- Sales Range: ${metrics?.salesLow || 'N/A'} - ${metrics?.salesHigh || 'N/A'}
- ROAS: ${metrics?.roas?.toFixed(2) || 'N/A'}x

Provide your assessment as a JSON object with:
{
  "rating": "Optimal" | "Strong" | "Acceptable" | "Needs Adjustment",
  "stars": 1-5,
  "summary": "2-3 sentence assessment",
  "optimizations": [
    {
      "priority": "high" | "medium" | "low",
      "channel": "channel_id",
      "channelName": "Display Name",
      "currentAllocation": 0.XX,
      "suggestedAllocation": 0.XX,
      "rationale": "Why this change",
      "expectedImpact": "+X% improvement"
    }
  ],
  "keyInsight": "Strategic insight about the mix"
}

Return ONLY valid JSON, no other text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const assessment = JSON.parse(jsonMatch[0]);
      res.json(assessment);
    } else {
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('AI Assessment error:', error);
    res.status(500).json({
      error: 'Failed to generate assessment',
      fallback: true
    });
  }
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
