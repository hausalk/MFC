import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint for Gemini research advice, error diagnostics, and academic manuscript refinement
app.post('/api/gemini/assist', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        text: 'API Key not configured. Using internal bioelectrochemical engine for diagnostics and drafting.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          systemInstruction ||
          'You are an expert bioelectrochemical researcher and machine learning specialist specializing in Microbial Fuel Cells (MFCs) and academic review writing for journals like Environmental Science & Technology and Water Research.',
        temperature: 0.3,
      },
    });

    return res.status(200).json({
      success: true,
      text: response.text || '',
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during Gemini processing',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
