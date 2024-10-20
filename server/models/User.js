const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    macros: {
      calories: Number,
      protein: Number,
      carbs: Number,
    },
  });
  
module.exports = mongoose.model('User', userSchema);

