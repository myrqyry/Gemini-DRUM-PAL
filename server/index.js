/* Simple local backend for development
 * - Exposes /api/generate-sound (POST) and /api/check-api-key (GET)
 * - Returns deterministic mock Tone.js sound configs for now
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const hasApiKey = !!process.env.GEMINI_API_KEY;

app.get('/api/check-api-key', (req, res) => {
  res.json({ hasApiKey });
});

function simpleSynthFromPrompt(prompt) {
  const text = (prompt || '').toLowerCase();
  if (text.includes('kick') || text.includes('deep')) {
    return {
      instrument: 'MembraneSynth',
      options: { pitchDecay: 0.01, octaves: 2 },
      effects: [{ type: 'PingPongDelay', options: { delayTime: 0.2 } }],
    };
  }
  if (text.includes('snare') || text.includes('crisp')) {
    return { instrument: 'NoiseSynth', options: { noise: { type: 'white' } } };
  }
  if (text.includes('clap') || text.includes('hand')) {
    return { instrument: 'AMSynth', options: { harmonicity: 2 } };
  }
  if (text.includes('metal') || text.includes('tin')) {
    return { instrument: 'MetalSynth', options: { frequency: 200 } };
  }
  // fallback
  return { instrument: 'Synth', options: { oscillator: { type: 'square' } } };
}

app.post('/api/generate-sound', async (req, res) => {
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt must be provided' });
  }

  // In the future, we could call the real GenAI API if GEMINI_API_KEY exists.
  const config = simpleSynthFromPrompt(prompt);
  res.json(config);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
