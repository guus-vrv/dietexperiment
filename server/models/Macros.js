const mongoose = require('mongoose');

// Define the Macros Schema
const MacrosSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
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
}, { timestamps: true });

const Macros = mongoose.model('Macros', MacrosSchema);
module.exports = Macros;
