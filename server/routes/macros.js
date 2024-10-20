const express = require('express');
const router = express.Router();
const Macros = require('../models/Macros');
const authMiddleware = require('../middleware/auth'); // Middleware to authenticate user

// Get user macros
router.get('/', authMiddleware, async (req, res) => {
  try {
    let macros = await Macros.findOne({ userId: req.userId });
    if (!macros) {
        return res.status(404).send('Macros not found');
    }
    res.json(macros);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update or create user macros
router.post('/', authMiddleware, async (req, res) => {
  const { calories, protein, carbohydrates } = req.body;

  try {
    let macros = await Macros.findOne({ userId: req.userId });

    if (macros) {
      // If macros already exist, update them
      macros.calories = calories;
      macros.protein = protein;
      macros.carbohydrates = carbohydrates;
    } else {
      // If no macros found, create new ones
      macros = new Macros({
        userId: req.userId,
        calories,
        protein,
        carbohydrates,
      });
    }

    await macros.save();
    res.json(macros);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
