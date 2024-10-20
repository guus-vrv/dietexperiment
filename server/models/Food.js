const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    foodName: String,
    feelingScore: Number,
    tastyScore: Number,
  });
  
const Food = mongoose.model('Food', foodSchema);
  
module.exports = Food;