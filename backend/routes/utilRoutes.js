// routes/utilsRoutes.js

const express = require("express");
const router = express.Router();
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);

router.post("/recognize-ingredients", (req, res) => {
  const { imageBase64, confidenceThreshold = 0.85 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Image is required" });
  }

  stub.PostModelOutputs(
    {
      model_id: "food-item-v1-recognition",
      inputs: [{ data: { image: { base64: imageBase64 } } }],
    },
    metadata,
    (err, response) => {
      if (err || response.status.code !== 10000) {
        console.error("Clarifai API error:", err || response.status.description);
        return res.status(500).json({ error: "Failed to recognize ingredients" });
      }

      const concepts = response.outputs[0]?.data?.concepts || [];
      const ingredients = concepts
        .filter((concept) => concept.value >= confidenceThreshold)
        .map((concept) => ({
          name: concept.name,
          confidence: concept.value,
        }));

      if (ingredients.length === 0) {
        return res.status(200).json({
          message: "No ingredients recognized with high confidence",
          ingredients: [],
        });
      }

      res.json({
        message: "Ingredients recognized",
        ingredients,
      });
    }
  );
});

module.exports = router;
