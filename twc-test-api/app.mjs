import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/users-routes.mjs';
import contactRouter from './routes/contacts-routes.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.PORT2;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/contacts', contactRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { tls: true })
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

