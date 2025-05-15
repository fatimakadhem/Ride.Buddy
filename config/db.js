const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Lägg till sökvägen till .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);  // Stoppa applikationen om vi inte kan ansluta
    }
};


module.exports = connectDB;
