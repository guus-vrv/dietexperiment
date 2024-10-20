const moment = require('moment');
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const FoodItem = require('../models/FoodItem');
const authMiddleware = require('../middleware/auth'); // Middleware to authenticate user

// ADD FOOD 
router.post('/', authMiddleware, async (req, res) => {
   
    const {foodName, portion, calories, protein, carbs, mealType, date} = req.body;

    try {
        // Check if food already exists
        let food = await Food.findOne({userId: req.userId, foodName: foodName}); 
        if (!food)
        {
           food = new Food ({userId: req.userId, foodName: foodName})
        }

        await food.save();

        let foodItem = new FoodItem ({userId: req.userId, foodId: food._id, date: date, mealType: mealType, foodName:foodName, portion:portion, calories:calories, protein:protein, carbohydrates:carbs});
  
        await foodItem.save();

        res.status(201).json({ foodItem });
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
  });

router.get('/food/:foodId', authMiddleware, async (req, res) => {

  const { foodId } = req.params;

  try {
    // Find the food item by ID
    let foodItem = await FoodItem.findOne({ foodId: foodId, userId: req.userId });
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    let food = await Food.findOne(({_id: foodId }));

    foodItem = {
      ...foodItem._doc,  // Spread the current foodItem properties
      feelingScore: food.feelingScore,
      tastyScore: food.tastyScore
    };

    console.log(foodItem);

    res.status(200).json(foodItem);

  } catch (err) {
    console.error('Error updating food item:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:currentDate', authMiddleware, async (req, res) => {
  try {
    // for fooditems with current date retrieve data and mealtype

    let date = req.params.currentDate;

    let foodItems = await FoodItem.find(({userId: req.userId, date: date}))
    .populate('foodId', 'feelingScore tastyScore');

    foodItems = foodItems.map((foodItem) => {
      return {
        ...foodItem._doc,  // Spread the existing properties of the foodItem
        feelingScore: foodItem.foodId.feelingScore,  // Add feelingScore from populated foodId
        tastyScore: foodItem.foodId.tastyScore       // Add tastyScore from populated foodId
      };
    });

    res.json(foodItems);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT route for updating a food item
router.put('/:foodId', authMiddleware, async (req, res) => {
  const { foodId } = req.params;
  const { foodName, portion, calories, protein, carbs, mealType, date, feelingScore, tastyScore } = req.body;

  try {
    // Find the food item by ID
    let foodItem = await FoodItem.findOne({ foodId: foodId, userId: req.userId });
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Update the food item with new values
    foodItem.foodName = foodName;
    foodItem.portion = portion;
    foodItem.calories = calories;
    foodItem.protein = protein;
    foodItem.carbohydrates = carbs;
    foodItem.mealType = mealType;
    foodItem.date = date;

    await foodItem.save();

    let food = await Food.findOne({_id: foodId, userId: req.userId});

    food.feelingScore = feelingScore;
    food.tastyScore = tastyScore;

    console.log(food);

    // Save the updated food item
    await food.save();

    res.status(200).json({ message: 'Food item updated successfully' });
  } catch (err) {
    console.error('Error updating food item:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:currentDate/accept', authMiddleware, async (req, res) => {
  try {
    // for fooditems with current date retrieve data and mealtype

    let data = "";

    res.json(data);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/:foodId/reject', authMiddleware, async (req, res) => {
  try {
    // for fooditems with current date retrieve data and mealtype

    let data = "";

    res.json(data);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    // for fooditems with current date retrieve data and mealtype

    let data = "";

    res.json(data);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;