import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import consultRoutes from './routes/consultantRoutes.js';
import contractorsRoutes from './routes/contractorRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import directorRoutes from './routes/directorRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import jobVacancyRoutes from './routes/jobVacancyRoutes.js';
import jobSeekerRoutes from './routes/jobSeekerRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

// Configure CORS properly
const allowedOrigins = [
  process.env.CORS_ORIGIN, 
  'http://localhost:3000', // For local development
  'https://mephub.vercel.app' // Your production frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[DB] MongoDB connected successfully'))
  .catch(err => console.error(`[DB ERROR] Connection failed: ${err.message}`));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  // Remove duplicate CORS headers (already handled by cors middleware)
  res.setHeader('X-Powered-By', 'MEP Hub API');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'MEP Hub API is live 🎉',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/consultants', consultRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/job-vacancies', jobVacancyRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/institutions', institutionRoutes);

// 404 handler
app.use((req, res) => {
  console.error(`[ROUTE ERROR] Not found: ${req.originalUrl}`);
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    details: `Endpoint ${req.originalUrl} does not exist`,
    suggestions: [
      'Check the API documentation for available endpoints',
      'Verify the request URL and method'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS Policy',
      message: 'Request not allowed from this origin',
      allowedOrigins
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[AUTH] Token expires in ${process.env.JWT_EXPIRE || '24h'}`);
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
});