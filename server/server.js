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

// ── Connect DB ────────────────────────────────────────────────────────────────
connectDB();

// ── CORS — production aur dev dono ke liye ───────────────────────────────────
app.use(cors({
  origin: true,              // sab origins allow — Railway same domain serve karta hai
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors());

// ── Helmet — CSP off rakho warna JS/CSS block hoti hai ────────────────────────
app.use(helmet({
  contentSecurityPolicy:       false,
  crossOriginResourcePolicy:   false,
  crossOriginEmbedderPolicy:   false,
}));

app.use(express.json({ limit: '10kb' }));
app.use(morgan('combined'));

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/users',    apiLimiter,  userRoutes);
app.use('/api/projects', apiLimiter,  projectRoutes);
app.use('/api/tasks',    apiLimiter,  taskRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success:    true,
    env:        process.env.NODE_ENV,
    ts:         new Date().toISOString(),
    distExists: fs.existsSync(path.join(__dirname, '../client/dist')),
  });
});

// ── Serve React build ─────────────────────────────────────────────────────────
// __dirname = /app/server  (Railway mein)
// client/dist = /app/client/dist
// const distPath  = path.join(__dirname, '..', 'client', 'dist');
// const indexFile = path.join(distPath, 'index.html');

const distPath = path.resolve(__dirname, '../client/dist');
const indexFile = path.resolve(distPath, 'index.html');

console.log('=== Static file paths ===');
console.log('distPath:', distPath);
console.log('indexFile:', indexFile);
console.log('dist exists:', fs.existsSync(distPath));
console.log('index exists:', fs.existsSync(indexFile));

if (fs.existsSync(distPath)) {
  // CSS, JS, images serve karo
  app.use(express.static(distPath));

  // Saari non-API requests React ko do
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found.' });
    }
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(503).send('Frontend build not found. Please redeploy.');
    }
  });
} else {
  // Dist nahi mila — error clearly batao
  console.error('ERROR: client/dist NOT FOUND at:', distPath);
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.status(503).json({
        error: 'Frontend not built',
        distPath,
        __dirname,
        files: fs.existsSync(path.join(__dirname, '..'))
          ? fs.readdirSync(path.join(__dirname, '..'))
          : 'parent dir not found',
      });
    }
  });
}

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});