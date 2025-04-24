const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
const waitlistRoutes = require('../routes/waitlist');
require('dotenv').config();

const app = express();

// Configure CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://lysa-frontend.vercel.app', // Replace with your production frontend URL
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

app.use(express.json());

// Routes
app.use('/api/waitlist', waitlistRoutes);

// Connect to MongoDB Atlas (cached connection for serverless)
let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    cachedDb = db;
    console.log('Connected to MongoDB Atlas');
    return db;
}

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Export as a serverless function
module.exports = serverless(app);
