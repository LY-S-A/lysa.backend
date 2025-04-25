// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const serverless = require('serverless-http');
// const waitlistRoutes = require('../routes/waitlist');
// require('dotenv').config();

// const app = express();

// // Configure CORS
// const allowedOrigins = [
//     'http://localhost:3000',
//     'https://lysa-frontend.vercel.app', // Replace with your production frontend URL
// ];
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
// }));

// app.use(express.json());

// // Routes
// app.use('/api/waitlist', waitlistRoutes);

// // Connect to MongoDB Atlas (cached connection for serverless)
// let cachedDb = null;
// async function connectToDatabase() {
//     if (cachedDb) {
//         return cachedDb;
//     }
//     // Debug: Log whether MONGODB_URI is defined
//     console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined');
//     if (!process.env.MONGODB_URI) {
//         throw new Error('MONGODB_URI environment variable is not defined');
//     }
//     const db = await mongoose.connect(process.env.MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     cachedDb = db;
//     console.log('Connected to MongoDB Atlas');
//     return db;
// }

// // Connect to MongoDB before handling requests
// app.use(async (req, res, next) => {
//     try {
//         await connectToDatabase();
//         next();
//     } catch (err) {
//         console.error('MongoDB connection error:', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Export as a serverless function
// module.exports = serverless(app);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');
const waitlistRoutes = require('../routes/waitlist');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://lysa-dev.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// app.options('.*', cors());

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
// app.use('/api/waitlist', waitlistRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'LYΣA Universe API' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404: Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

module.exports = serverless(app);
