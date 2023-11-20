const mongoose = require('mongoose');

const collectionName = 'grades';

const setupIndexesAndValidation = async () => {
  try {
    const Grade = mongoose.model('Grade'); // Assuming you have defined the Grade model

    // Create indexes
    await Grade.createIndexes([
      { key: { class_id: 1 } },
      { key: { learner_id: 1 } },
      { key: { learner_id: 1, class_id: 1 } },
    ]);

    // Create collection with validation if it doesn't exist
    const collectionExists = await mongoose.connection.db.listCollections({ name: collectionName }).hasNext();
    if (!collectionExists) {
      await Grade.createCollection({
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
    await mongoose.connection.db.command({
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
  collectionName,
  setupIndexesAndValidation,
};