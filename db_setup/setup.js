const express = require("express");
const { getDB } = require('../db/connection');

const router = express.Router();
const collectionName = 'grades';

const setupIndexesAndValidation = async () => {
  try {
    const db = getDB();

    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection(collectionName);

    // Create indexes
    await collection.createIndex({ class_id: 1 });
    await collection.createIndex({ learner_id: 1 });
    await collection.createIndex({ learner_id: 1, class_id: 1 });

    // Create collection with validation if it doesn't exist
    if (!(await db.listCollections({ name: collectionName }).hasNext())) {
      await db.createCollection(collectionName, {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['class_id', 'learner_id'],
            properties: {
              class_id: {
                bsonType: 'int',
                minimum: 0,
                maximum: 300,
                description: 'Must be an integer between 0 and 300 (inclusive).',
              },
              learner_id: {
                bsonType: 'int',
                minimum: 0,
                description: 'Must be an integer greater than or equal to 0.',
              },
            },
          },
        },
      });
    }

    // Update collection validation
    await db.command({
        collMod: collectionName,
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['class_id', 'learner_id'],
            properties: {
              class_id: {
                bsonType: 'int',
                minimum: 0,
                maximum: 300,
                description: 'Must be an integer between 0 and 300 (inclusive).',
              },
              learner_id: {
                bsonType: 'int',
                minimum: 0,
                description: 'Must be an integer greater than or equal to 0.',
              },
            },
          },
        },
        validationAction: 'warn',
      });

    console.log('Indexes and validation rules set up successfully');
  } catch (error) {
    console.error('Error during setup:', error);
  }
};

module.exports = {
  router,
  collectionName,
  setupIndexesAndValidation,
};