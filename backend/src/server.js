const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/auth');

// Load environment variables from the .env file in the backend directory
dotenv.config({ path: path.join(__dirname, '../.env') }); 

connectDB(); 

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins. In production, configure this more securely.
app.use(express.json()); // Parse incoming JSON requests

// API Routes
app.use('/api/auth', authRoutes); // Mount authentication routes at /api/auth

const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
