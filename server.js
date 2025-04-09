import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import consultRoutes from './routes/consultantRoutes.js';
import contractorsRoutes from './routes/contractorRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();


const corsOptions = {
  origin: process.env.CORS_ORIGIN, // This reads the production domain from the .env file
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[DB] MongoDB connected successfully'))
  .catch(err => console.error(`[DB ERROR] Connection failed: ${err.message}`));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/consultants', consultRoutes);
app.use('/api/contractors', contractorsRoutes);
app.use('/api/agents', agentRoutes);

app.use((req, res) => {
  console.error(`[ROUTE ERROR] Not found: ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    details: `Endpoint ${req.originalUrl} does not exist` 
  });
});


app.get('/', (req, res) => {
  res.send({ message: 'MEP Hub API is live 🎉' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[AUTH] Token expires in ${process.env.JWT_EXPIRE}`);
});