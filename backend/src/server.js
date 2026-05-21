require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://assignly-topaz.vercel.app',
    'https://assignly-git-main-aaryanbhople005-beeps-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Enable pre-flight for all routes
app.options('*', cors());

// Health check for Render
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Assignly Backend Running' });
});

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Centralized error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ success: false, message: err.message });
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

connectDB();
