import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import followupRouter from './routes/followup.js';
import leadRouter from './routes/lead.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// ── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Evaflux API is running',
    version: '1.0.0',
    endpoints: ['/api/followup', '/api/leads'],
  });
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/followup', followupRouter);
app.use('/api/leads', leadRouter);

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Evaflux backend running on http://localhost:${PORT}`);
});