// Import necessary modules and functions
const express = require('express');
const { getDB } = require('./db'); // Import your database connection function

// Create an Express Router instance
const router = express.Router();

// Define a GET route at '/grades/stats' to retrieve overall statistics
router.get('/stats', async (req, res) => {
  try {
    // Get a reference to the database using the imported function
    const db = getDB();

    // Check if the database connection is established, throw an error if not
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Get a reference to the 'grades' collection in the database
    const Grade = db.collection('grades');

    // Count the total number of learners in the 'grades' collection
    const totalLearners = await Grade.countDocuments();

    // Perform an aggregation to calculate the number and percentage of learners with a weighted average above 70
    const aboveSeventyPercent = await Grade.aggregate([
      {
        $group: {
          _id: null,
          count: {
            $sum: {
              $cond: [{ $gt: ['$weightedAverage', 70] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();

    // Extract the count of learners with a weighted average above 70
    const numberOfAboveSeventy = aboveSeventyPercent.length > 0 ? aboveSeventyPercent[0].count : 0;

    // Calculate the percentage of learners with a weighted average above 70
    const percentageAboveSeventy = (numberOfAboveSeventy / totalLearners) * 100;

    // Send the calculated statistics as a JSON response
    return res.json({
      numberOfAboveSeventy,
      totalLearners,
      percentageAboveSeventy
    });
  } catch (error) {
    // Handle errors by sending a 500 Internal Server Error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a GET route at '/grades/stats/:id' to retrieve statistics for a specific class
router.get('/stats/:id', async (req, res) => {
  try {
    // Get a reference to the database using the imported function
    const db = getDB();

    // Check if the database connection is established, throw an error if not
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Get a reference to the 'grades' collection in the database
    const Grade = db.collection('grades');

    // Extract the class_id parameter from the request URL
    const classId = req.params.id;

    // Match learners in the specified class using the $match stage in the aggregation pipeline
    const matchStage = {
      $match: {
        class_id: classId // Assuming your collection has a 'class_id' field
      }
    };

    // Perform an aggregation to calculate the number and percentage of learners with a weighted average above 70 for the specified class
    const aboveSeventyPercent = await Grade.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          count: {
            $sum: {
              $cond: [{ $gt: ['$weightedAverage', 70] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();

    // Count the total number of learners in the specified class
    const totalLearnersInClass = await Grade.countDocuments({ class_id: classId });

    // Extract the count of learners with a weighted average above 70 for the specified class
    const numberOfAboveSeventy = aboveSeventyPercent.length > 0 ? aboveSeventyPercent[0].count : 0;

    // Calculate the percentage of learners with a weighted average above 70 for the specified class
    const percentageAboveSeventy = (numberOfAboveSeventy / totalLearnersInClass) * 100;

    // Send the calculated statistics for the specified class as a JSON response
    return res.json({
      numberOfAboveSeventy,
      totalLearnersInClass,
      percentageAboveSeventy
    });
  } catch (error) {
    // Handle errors by sending a 500 Internal Server Error response
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;