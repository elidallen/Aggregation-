const { MongoClient } = require('mongodb');

const connectionString = 'mongodb://localhost:3000/mongodb+srv://fakey:1805allen13@cluster0.xuoyq4t.mongodb.net/'; // Your MongoDB connection string

let db;

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    db = client.db(); // Specify your database name if needed
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

function getDB() {
  return db;
}

module.exports = { connectToMongoDB, getDB };