const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food', // Reference to the User model
        required: true,
      },
    date: {
        type: String,
        required: true,  // Set this to true if every food entry should have an associated date
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: true,
    },
    foodName: String,
    portion: {
      type: Number,
      required: true,
    },
    calories: {
        type: Number,
        required: true,
      },
    protein: {
        type: Number,
        required: true,
      },
    carbohydrates: {
        type: Number,
        required: true,
      },
  });
  
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
  
module.exports = FoodItem;