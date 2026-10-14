import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    destination = 'Varanasi',
    duration = 3,
    budget = 'moderate',
    travelStyle = 'cultural-deep-dive',
    interests = ['Heritage', 'Spiritual', 'Local Crafts'],
  } = req.body || {};

  const durationNum = Math.min(Math.max(parseInt(String(duration), 10) || 3, 1), 7);

  const prompt = `You are BharatExplore's expert Indian cultural tourism travel planner and verified historian.
Generate a comprehensive, culturally authentic day-by-day travel itinerary for a journey to "${destination}", India.

Trip parameters:
- Destination: ${destination}
- Duration: ${durationNum} Days
- Travel Category / Budget: ${budget}
- Travel Style: ${travelStyle}
- Key Interests: ${Array.isArray(interests) ? interests.join(', ') : 'Monuments, Regional Cuisine, Local Heritage'}

Return ONLY a valid JSON object matching this exact structure:
{
  "tripTitle": "Compelling Title for this Indian Odyssey",
  "summary": "2-3 sentences overview capturing the spirit of the trip, cultural essence, and practical highlights.",
  "destination": "${destination}",
  "durationDays": ${durationNum},
  "bestSeasonAdvice": "Specific regional weather advice for this destination and date.",
  "estimatedBudget": {
    "totalINR": 18500,
    "breakdown": {
      "accommodation": "Estimated stay cost breakdown in ₹",
      "activitiesAndTours": "Guided monuments, tickets, safaris in ₹",
      "foodAndDining": "Regional thalis, street food, dining in ₹",
      "localTransport": "Autos, cabs, or regional trains in ₹"
    }
  },
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme of Day 1",
      "morning": {
        "activity": "Morning attraction or activity",
        "details": "Specific tips, entry timing, and architectural/cultural context"
      },
      "afternoon": {
        "activity": "Afternoon exploration or museum visit",
        "details": "Rest, local handicraft cluster, or sheltered heritage site"
      },
      "evening": {
        "activity": "Evening ceremony, sunset point, or cultural performance",
        "details": "Aarti, sound & light show, or traditional bazaar stroll"
      },
      "localFoodRecommendation": {
        "dish": "Authentic regional dish or thali",
        "whereToTry": "Recommended type of local eatery, sweet shop, or heritage café"
      },
      "transportTip": "Practical local transit advice for this day"
    }
  ],
  "localFoodHighlights": [
    "List of 4-5 iconic dishes, street delicacies, or beverages specific to ${destination}"
  ],
  "packingAndCulturalTips": [
    "3-4 practical packing, attire, and etiquette tips"
  ],
  "sustainableTravelAdvice": "One tip on supporting local artisans, community homestays, or leaving no trace."
}

Ensure all day entries from day 1 to ${durationNum} are present with genuine landmarks, realistic geography, and respectful Indian cultural heritage. Do not wrap in markdown quotes if possible, output pure JSON.`;

  try {
    if (geminiApiKey) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(text);
        return res.status(200).json({
          success: true,
          source: 'gemini',
          itinerary: parsed,
        });
      } catch (parseErr) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.status(200).json({
            success: true,
            source: 'gemini',
            itinerary: parsed,
          });
        }
      }
    }
  } catch (err: any) {
    console.error('Gemini Vercel API generation error:', err);
  }

  // Curated Fallback
  return res.status(200).json({
    success: true,
    source: 'curated-fallback',
    itinerary: {
      tripTitle: `${destination} Heritage & Cultural Explorer`,
      summary: `An immersive journey through the historic corridors, regional crafts, and architectural marvels of ${destination}.`,
      destination,
      durationDays: durationNum,
      bestSeasonAdvice: 'October to March offers optimal daytime temperatures for walking heritage tours.',
      estimatedBudget: {
        totalINR: durationNum * 4200,
        breakdown: {
          accommodation: `₹${(durationNum * 2200).toLocaleString()} (Verified heritage homestay)`,
          activitiesAndTours: `₹${(durationNum * 800).toLocaleString()} (Monument entries & guide fees)`,
          foodAndDining: `₹${(durationNum * 800).toLocaleString()} (Regional thalis & authentic dining)`,
          localTransport: `₹${(durationNum * 400).toLocaleString()} (E-rickshaws & local transit)`,
        },
      },
      days: Array.from({ length: durationNum }, (_, i) => ({
        dayNumber: i + 1,
        theme: i === 0 ? 'Historic Quarters & Sacred Monuments' : i === 1 ? 'Artisan Guilds & Living Traditions' : 'Living Heritage & Sunset Trails',
        morning: {
          activity: `Heritage walk and morning architectural exploration in ${destination}`,
          details: 'Begin early at sunrise to capture soft natural light and experience peaceful heritage courtyards before crowds gather.',
        },
        afternoon: {
          activity: 'Local handicraft cooperative or museum visit',
          details: 'Explore indigenous weaving clusters, metalcraft workshops, or regional archaeology galleries.',
        },
        evening: {
          activity: 'Traditional evening cultural ceremony or sunset panorama',
          details: 'Gather at the prominent historic vantage point or river promenade for daily cultural rituals.',
        },
        localFoodRecommendation: {
          dish: 'Authentic regional signature thali and artisanal sweets',
          whereToTry: 'Historic bazaar eateries and heritage culinary outlets recommended by locals.',
        },
        transportTip: 'Opt for certified local auto-rickshaws or walking trails within historic districts.',
      })),
      localFoodHighlights: [
        'Authentic regional breakfast preparations',
        'Traditional multi-course thali served on banana leaf or kansa ware',
        'Seasonal artisanal sweets and spiced chai',
      ],
      packingAndCulturalTips: [
        'Modest attire covering shoulders and knees when visiting sacred monuments',
        'Slip-on footwear convenient for regular removal at temple and monument sanctums',
        'Carry reusable water bottles and cash for small purchases at craft clusters',
      ],
      sustainableTravelAdvice: 'Purchase handicrafts directly from artisan cooperatives to ensure zero intermediary deductions.',
    },
  });
}
