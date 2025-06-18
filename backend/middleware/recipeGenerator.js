const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateRecipe = async ({ ingredients, members, cuisine, language }) => {
  const prompt = `
Create a recipe with the following details:

- Cuisine: ${cuisine}
- Ingredients: ${JSON.stringify(ingredients)}
- Serves: ${members} people
- Language: ${language}

Return response in **valid JSON format only**, with the following structure:
{
  "title": "Recipe Title",
  "ingredients": [ { "item": "ingredient", "quantity": "amount" } ],
  "steps": [ { "step": 1, "instruction": "text" }, ... ],
  "servingSuggestions": "text",
  "nutrition": {
    "total": { "calories": "X kcal", "protein": "X g", "carbs": "X g", "fat": "X g" },
    "perServing": { "calories": "X kcal", "protein": "X g", "carbs": "X g", "fat": "X g" }
  }
}
Make sure the nutrition is estimated based on the ingredients and serving size.
`;


  try {
    const result = await model.generateContent(prompt);
    console.log("Full AI Response:", result.response.text()); // Log the entire response object

    // Remove any markdown formatting from the response
    let jsonData = result.response.text().trim();
    jsonData = jsonData.replace(/```json|```/g, ""); // Remove triple backticks

    // Parse the cleaned JSON data
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate recipe");
  }
};

module.exports = { generateRecipe };
