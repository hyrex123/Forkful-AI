const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./db/database");
const {ClarifaiStub,grpc}=require('clarifai-nodejs-grpc')
// Import Routes
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favouriteRoutes");
const utilsRoutes=require('./routes/utilRoutes')

dotenv.config();
const app = express();
const PORT = 5001;


// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://recipe-creator-ai.netlify.app"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json({limit:"10mb"}));
app.use(cookieParser());

// Connect Database
console.log(process.env.EMAIL_USER);
connectDB();

// Routes
app.use("/auth/v1/users", userRoutes);
app.use("/auth/v1/recipes", recipeRoutes);
app.use("/auth/v1/fav", favoriteRoutes);
app.use("/auth/v1/api", utilsRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
