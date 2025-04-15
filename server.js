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
import contactRoutes from './routes/contactRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'https://mephub.vercel.app',
  'https://mephub-fz4lcida2-himanthas-projects.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight across-the-board

// Database connection with improved error handling
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('[DB] MongoDB connected successfully'))
.catch(err => {
  console.error(`[DB ERROR] Connection failed: ${err.message}`);
  process.exit(1);
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'MEP Hub API');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
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
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS Policy',
      message: 'Request not allowed from this origin',
      allowedOrigins,
      yourOrigin: req.headers.origin || 'Not provided'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[SERVER] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[AUTH] Token expires in ${process.env.JWT_EXPIRE || '24h'}`);
  console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[UNHANDLED REJECTION] ${err.stack}`);
  server.close(() => process.exit(1));
});