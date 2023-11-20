const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://fakey:1805allen13@cluster0.xuoyq4t.mongodb.net/';
let db;

async function connectToMongoDB() {
  try {
    await mongoose.connect(connectionString, {
      
    });

    console.log('Connected to MongoDB');
    db = mongoose.connection;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

function getDB() {
  return db;
}

module.exports = { connectToMongoDB, getDB };