// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');

// // Route imports
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const taskRoutes = require('./routes/taskRoutes');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // // ── Security & Utility Middleware ──────────────────────────────────────────
// // app.use(helmet());                          // Sets secure HTTP headers
// // app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// // app.use(express.json({ limit: '10kb' }));   // Body parser with size limit
// // app.use(morgan('dev'));                      // Request logger (dev only)

// // ── Security ───────────────────────────────────────────────────────────────
// app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// const allowedOrigins = process.env.NODE_ENV === 'production'
//   ? [process.env.CLIENT_URL]
//   : ['http://localhost:5173', 'http://localhost:3000'];

// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
//     cb(new Error(`CORS blocked: ${origin}`));
//   },
//   credentials: true,
// }));

// app.use(express.json({ limit: '10kb' }));
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// // ── Rate Limiters ──────────────────────────────────────────────────────────

// // Auth routes — strict (prevent brute force login attacks)
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  // 15 minutes
//   max: 20,                    // 20 login attempts per 15 min per IP
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
//   skip: () => process.env.NODE_ENV === 'development', // skip in dev
// });

// // General API routes — generous for normal usage
// const apiLimiter = rateLimit({
//   windowMs: 60 * 1000,        // 1 minute window
//   max: 300,                   // 300 requests per minute per IP
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many requests. Please slow down.' },
//   skip: () => process.env.NODE_ENV === 'development', // skip in dev
// });
// // ── Routes ─────────────────────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);
// // Health check
// app.get('/api/health', (_req, res) =>
//   res.json({ success: true, env: process.env.NODE_ENV, ts: new Date().toISOString() })
// );

// // ── Serve React in production ──────────────────────────────────────────────
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/dist')));
//   app.get('*', (req, res) => {
//     if (!req.path.startsWith('/api')) {
//       res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
//     }
//   });
// }

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
// );








const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');
const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes    = require('./routes/taskRoutes');

const app = express();
connectDB();

// // ── CORS — must be before helmet and all routes ────────────────────────────
// const allowedOrigins = process.env.NODE_ENV === 'production'
//   ? [process.env.CLIENT_URL]
//   : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

// app.use(cors({
//   origin: (origin, cb) => {
//     // Allow requests with no origin (mobile apps, Postman, curl)
//     if (!origin) return cb(null, true);
//     if (allowedOrigins.includes(origin)) return cb(null, true);
//     cb(new Error(`CORS blocked: ${origin}`));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 204,
// }));

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Sanitize request data — prevent NoSQL injection ($where, $gt attacks)
app.use(mongoSanitize());

// Sanitize user input — strip HTML/script tags from req.body
app.use(xss());


// CORS: allow only your Railway frontend URL in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL]                         // e.g. https://taskflow.up.railway.app
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server calls (Postman, Railway health checks) with no origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Handle preflight OPTIONS requests explicitly
app.options('*', cors());

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Rate Limiters ──────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  skip: () => process.env.NODE_ENV === 'development',
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  skip: () => process.env.NODE_ENV === 'development',
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/users',    apiLimiter,  userRoutes);
app.use('/api/projects', apiLimiter,  projectRoutes);
app.use('/api/tasks',    apiLimiter,  taskRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ success: true, env: process.env.NODE_ENV, ts: new Date().toISOString() })
);

// ── Serve React in production ──────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    }
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
);