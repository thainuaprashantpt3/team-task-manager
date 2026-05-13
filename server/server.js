const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const fs        = require('fs');
require('dotenv').config();

const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');
const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes    = require('./routes/taskRoutes');

const app = express();

connectDB();



// ── Static files FIRST — before helmet ───────────────────────────────────────
const distPath  = path.resolve(__dirname, '..', 'client', 'dist');
const indexFile = path.resolve(distPath, 'index.html');

console.log('dist exists:', fs.existsSync(distPath));
console.log('index exists:', fs.existsSync(indexFile));

// Serve assets BEFORE helmet so nothing blocks JS/CSS
if (fs.existsSync(distPath)) {
  app.use('/assets', express.static(path.join(distPath, 'assets')));
  app.use(express.static(distPath));
}

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors());

// ── Helmet — disabled CSP so it does not block JS/CSS ────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(express.json({ limit: '10kb' }));
app.use(morgan('combined'));

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/users',    apiLimiter,  userRoutes);
app.use('/api/projects', apiLimiter,  projectRoutes);
app.use('/api/tasks',    apiLimiter,  taskRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ success: true, env: process.env.NODE_ENV, ts: new Date().toISOString() })
);

// ── React catch-all ───────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Route not found.' });
  }
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  res.status(503).send('App not built.');
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
);