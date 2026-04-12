const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hp: Number,
  cp: Number,
  picture: String,
  types: [String],
  metadata: mongoose.Schema.Types.Mixed 
}, { timestamps: true });

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// Helper function for API response
const success = (message, data) => {
  return {
    message: message,
    data: data
  };
};


module.exports = {
  Pokemon,
  success,
};