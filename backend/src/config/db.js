const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('Error: MONGODB_URI is not defined in the environment variables.');
      process.exit(1);
    }
    
    // Check for common formatting mistakes
    const hasBrackets = uri.includes('<') || uri.includes('>');
    const atCount = (uri.match(/@/g) || []).length;
    
    // Log helpful debugging clues without exposing the password
    console.log('--- DB Connection Debug ---');
    console.log(`URI Length: ${uri.length}`);
    console.log(`Contains < or >: ${hasBrackets ? 'YES (Remove them!)' : 'No'}`);
    console.log(`Number of @ symbols: ${atCount} (Should be 1 before the host)`);
    
    const maskedUri = uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
    console.log(`Attempting connection: ${maskedUri}`);
    console.log('---------------------------');

    await mongoose.connect(uri);
    console.log('MongoDB Connected...');
  } catch (err) {
    if (err.message.includes('authentication failed')) {
      console.error('MongoDB Error: Authentication failed. This means your USERNAME or PASSWORD is wrong.');
      console.error('1. Check that you removed the < > brackets.');
      console.error('2. Ensure your password in .env matches the one you set in Atlas Database Access.');
      console.error('3. Make sure there are no spaces in the .env file.');
    } else {
      console.error('MongoDB connection error:', err.message);
    }
    process.exit(1); 
  }
};

module.exports = connectDB;
