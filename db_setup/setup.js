const express = require('express');
const { getDB } = require('./db');

const router = express.Router();
const collectionName = 'grades';

const setupIndexesAndValidation = async () => {
  try {
    const db = getDB();

    if (!db) {
      throw new Error('Database connection not established');
    }

    await db[collectionName].createIndex({ class_id: 1 });
    await db[collectionName].createIndex({ learner_id: 1 });
    await db[collectionName].createIndex({ learner_id: 1, class_id: 1 });

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

    await db.runCommand({
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