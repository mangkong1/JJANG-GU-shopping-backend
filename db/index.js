import mongoose from 'mongoose';

const DB_URL = process.env.Atlas_URL;

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('connected', () => {
    console.log('Successfully connected to database');
});
db.on('error', (error) => {
    console.error('Failed to connect to database');
});