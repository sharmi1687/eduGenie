import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility on the server with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for error handling
function handleError(res: Response, error: unknown, fallbackMessage: string) {
  console.error(fallbackMessage, error);
  const message = error instanceof Error ? error.message : fallbackMessage;
  res.status(500).json({ error: message });
}

// ----------------------------------------------------
// 1. POCKETSMART AI API
// ----------------------------------------------------
app.post('/api/pocketsmart/analyze', async (req: Request, res: Response) => {
  try {
    const { monthlyIncome, expenses, goals, currency = 'USD' } = req.body;

    const totalExpenses = (expenses || []).reduce(
      (sum: number, item: { amount: number }) => sum + (Number(item.amount) || 0),
      0
    );

    const prompt = `You are PocketSmart AI, an expert personal finance and budget recommendation assistant built with Google Gemini for students and professionals.
Analyze the following financial data:
- Monthly Net Income: ${currency} ${monthlyIncome}
- Current Expenses: ${JSON.stringify(expenses, null, 2)}
- Total Monthly Expenses: ${currency} ${totalExpenses}
- Financial Goals: ${goals || 'Optimize savings, cut wasteful spending, and build an emergency fund'}

Provide a comprehensive, encouraging, and highly analytical response strictly matching the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: {
              type: Type.INTEGER,
              description: 'Score from 0 to 100 assessing overall financial health',
            },
            healthRating: {
              type: Type.STRING,
              description: 'Excellent, Good, Fair, or Needs Attention',
            },
            executiveSummary: {
              type: Type.STRING,
              description: '2-3 sentence high-level financial diagnosis',
            },
            savingsRate: {
              type: Type.NUMBER,
              description: 'Calculated savings percentage based on income vs expenses',
            },
            fiftyThirtyTwenty: {
              type: Type.OBJECT,
              properties: {
                needsPercent: { type: Type.NUMBER },
                wantsPercent: { type: Type.NUMBER },
                savingsPercent: { type: Type.NUMBER },
                analysis: { type: Type.STRING },
              },
              required: ['needsPercent', 'wantsPercent', 'savingsPercent', 'analysis'],
            },
            topSavingsOpportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  potentialMonthlySavings: { type: Type.NUMBER },
                  tip: { type: Type.STRING },
                  difficulty: { type: Type.STRING }, // 'Easy', 'Medium', 'Hard'
                },
                required: ['category', 'potentialMonthlySavings', 'tip', 'difficulty'],
              },
            },
            actionableRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            investmentAdvice: {
              type: Type.STRING,
              description: 'Beginner-friendly savings & investment roadmap',
            },
          },
          required: [
            'healthScore',
            'healthRating',
            'executiveSummary',
            'savingsRate',
            'fiftyThirtyTwenty',
            'topSavingsOpportunities',
            'actionableRecommendations',
            'investmentAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    handleError(res, err, 'PocketSmart AI analysis failed');
  }
});

// ----------------------------------------------------
// 2. LEGALEASE API
// ----------------------------------------------------
app.post('/api/legalease/generate', async (req: Request, res: Response) => {
  try {
    const {
      documentType,
      partyA,
      partyB,
      jurisdiction,
      effectiveDate,
      keyTerms,
      specialClauses,
      strictness = 'Balanced',
    } = req.body;

    const prompt = `You are LegalEase, an advanced AI-powered legal document drafting assistant built with Google Gemini.
Generate a legally structured, professional, ready-to-use legal document for:
Document Type: ${documentType}
First Party / Disclosing Party / Landlord / Client: ${partyA}
Second Party / Receiving Party / Tenant / Contractor: ${partyB}
Governing Law & Jurisdiction: ${jurisdiction}
Effective Date: ${effectiveDate}
Core Terms & Scope: ${keyTerms}
Special Clauses / Inclusions: ${specialClauses || 'Standard protection clauses'}
Strictness / Tone: ${strictness}

Return a valid JSON object matching the requested schema. Provide a complete, fully drafted contract in markdown format with clear numbering, legal definitions, representations, covenants, termination clauses, and signature blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            contractMarkdown: {
              type: Type.STRING,
              description: 'Full markdown formatted legal contract text',
            },
            plainEnglishSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key obligations summarized in simple bullet points',
            },
            riskAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clauseName: { type: Type.STRING },
                  riskLevel: { type: Type.STRING }, // 'Low', 'Medium', 'High'
                  explanation: { type: Type.STRING },
                },
                required: ['clauseName', 'riskLevel', 'explanation'],
              },
            },
            criticalDatesAndObligations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'title',
            'contractMarkdown',
            'plainEnglishSummary',
            'riskAnalysis',
            'criticalDatesAndObligations',
            'disclaimer',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    handleError(res, err, 'LegalEase document generation failed');
  }
});

// ----------------------------------------------------
// 3. COMICCRAFT API
// ----------------------------------------------------
app.post('/api/comiccraft/generate', async (req: Request, res: Response) => {
  try {
    const {
      premise,
      genre = 'Superhero',
      artStyle = 'Modern Marvel/DC Comic Book',
      panelCount = 4,
      targetAudience = 'Young Adult',
    } = req.body;

    const prompt = `You are ComicCraft, an AI Comic Story Creator powered by Gemini Models.
Create a dynamic, visually gripping comic strip script and story.
Premise: ${premise}
Genre: ${genre}
Visual Art Style: ${artStyle}
Number of Panels: ${panelCount}
Target Audience: ${targetAudience}

Design an engaging narrative arc with visual descriptions, camera framing, lighting, expressive dialogue bubbles, and classic comic sound effects.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            genre: { type: Type.STRING },
            artStyleGuide: { type: Type.STRING },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  visualAppearance: { type: Type.STRING },
                },
                required: ['name', 'role', 'visualAppearance'],
              },
            },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panelNumber: { type: Type.INTEGER },
                  cameraShot: { type: Type.STRING }, // 'Wide establishing shot', 'Close-up', 'Dutch angle'
                  sceneDescription: { type: Type.STRING },
                  moodAndLighting: { type: Type.STRING },
                  charactersPresent: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  dialogue: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        balloonType: { type: Type.STRING }, // 'speech', 'shout', 'whisper', 'thought'
                      },
                      required: ['speaker', 'text', 'balloonType'],
                    },
                  },
                  soundEffects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  narrationBox: { type: Type.STRING },
                  imageGenerationPrompt: {
                    type: Type.STRING,
                    description: 'Detailed prompt for an AI image generator to produce this panel',
                  },
                },
                required: [
                  'panelNumber',
                  'cameraShot',
                  'sceneDescription',
                  'moodAndLighting',
                  'charactersPresent',
                  'dialogue',
                  'soundEffects',
                  'imageGenerationPrompt',
                ],
              },
            },
          },
          required: ['title', 'tagline', 'genre', 'artStyleGuide', 'characters', 'panels'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    handleError(res, err, 'ComicCraft generation failed');
  }
});

// ----------------------------------------------------
// 4. EDUGENIE API
// ----------------------------------------------------
app.post('/api/edugenie/explain', async (req: Request, res: Response) => {
  try {
    const { topic, gradeLevel = 'Undergraduate', technique = 'Feynman Technique' } = req.body;

    const prompt = `You are EduGenie, a Google Gemini powered Learning Assistant.
Explain the topic: "${topic}"
Target Level: ${gradeLevel}
Teaching Method: ${technique} (Use simple analogies, breaking down jargon, real-world examples, and intuition before formulas).

Generate a structured study package including clear explanations, key concepts, interactive flashcards, and an active recall practice quiz with instant explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            simpleAnalogy: {
              type: Type.STRING,
              description: 'A vivid, relatable everyday analogy explaining the core idea',
            },
            deepDiveExplanation: {
              type: Type.STRING,
              description: 'Comprehensive, structured educational breakdown in markdown',
            },
            commonPitfalls: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Frequent misconceptions students make',
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['question', 'answer'],
              },
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctIndex', 'explanation'],
              },
            },
          },
          required: [
            'topic',
            'simpleAnalogy',
            'deepDiveExplanation',
            'commonPitfalls',
            'flashcards',
            'quiz',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    handleError(res, err, 'EduGenie explanation failed');
  }
});

// ----------------------------------------------------
// 5. FITBUDDY API
// ----------------------------------------------------
app.post('/api/fitbuddy/generate', async (req: Request, res: Response) => {
  try {
    const {
      primaryGoal = 'Muscle Building & Hypertrophy',
      fitnessLevel = 'Intermediate',
      daysPerWeek = 4,
      equipment = 'Full Gym Access',
      dietaryPreference = 'Balanced / High Protein',
      limitations = 'None',
    } = req.body;

    const prompt = `You are FitBuddy, an AI Fitness Plan Generator built using Gemini Models.
Design a highly scientific, personalized weekly workout and nutrition plan.
Primary Goal: ${primaryGoal}
Fitness Level: ${fitnessLevel}
Training Frequency: ${daysPerWeek} days/week
Available Equipment: ${equipment}
Dietary Preference: ${dietaryPreference}
Physical Limitations / Injuries: ${limitations}

Provide structured weekly split, exercise instructions, target sets/reps, form cues, and daily nutrition targets.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            programName: { type: Type.STRING },
            trainerPhilosophy: { type: Type.STRING },
            targetMetrics: {
              type: Type.OBJECT,
              properties: {
                dailyCalories: { type: Type.INTEGER },
                proteinGrams: { type: Type.INTEGER },
                carbsGrams: { type: Type.INTEGER },
                fatGrams: { type: Type.INTEGER },
                hydrationLiters: { type: Type.NUMBER },
              },
              required: [
                'dailyCalories',
                'proteinGrams',
                'carbsGrams',
                'fatGrams',
                'hydrationLiters',
              ],
            },
            weeklyRoutine: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayLabel: { type: Type.STRING }, // e.g. "Day 1 - Push Focus"
                  focusMuscles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  warmup: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.STRING }, // "8-12"
                        restSeconds: { type: Type.INTEGER },
                        formCue: { type: Type.STRING },
                      },
                      required: ['name', 'sets', 'reps', 'restSeconds', 'formCue'],
                    },
                  },
                  cooldown: { type: Type.STRING },
                },
                required: ['dayLabel', 'focusMuscles', 'warmup', 'exercises', 'cooldown'],
              },
            },
            nutritionMealIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  meal: { type: Type.STRING }, // "Breakfast", "Lunch", "Pre-workout", "Dinner"
                  idea: { type: Type.STRING },
                  macrosSummary: { type: Type.STRING },
                },
                required: ['meal', 'idea', 'macrosSummary'],
              },
            },
            coachAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'programName',
            'trainerPhilosophy',
            'targetMetrics',
            'weeklyRoutine',
            'nutritionMealIdeas',
            'coachAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    handleError(res, err, 'FitBuddy plan generation failed');
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
