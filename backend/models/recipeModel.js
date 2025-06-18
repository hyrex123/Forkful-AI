const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String },
  notes: { type: String },
});

const instructionSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  instruction: { type: String, required: true },
});

// const recipeSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   cuisine: { type: String, required: true },
//   ingredients: [ingredientSchema],
//   instructions: [instructionSchema],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User
//   createdAt: { type: Date, default: Date.now },
// });
const recipeSchema= new mongoose.Schema({
  title: String,
  cuisine: String,
  ingredients: [
    {
      item: String,
      quantity: String,
    },
  ],
  steps: [
    instructionSchema
  ],
  servingSuggestions: String,
  nutrition: {
    total: {
      calories: String,
      protein: String,
      carbs: String,
      fat: String,
    },
    perServing: {
      calories: String,
      protein: String,
      carbs: String,
      fat: String,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
