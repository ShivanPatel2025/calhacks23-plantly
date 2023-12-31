require("dotenv").config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT environment variable if available
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Enable CORS
app.use(cors());

// Define the schema and model outside of the connectDB function
const plantSchema = new mongoose.Schema({
  "Common Name": String,
  "Scientific Name": String,
  "Watering Frequency": String,
  "Sunlight Preference": String,
});
const Plant = new mongoose.model("plants", plantSchema);

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  plants: [
    {
      "Common Name": String,
      "Display Name": String,
      "Age": Number,
      "Icon": String,
      "Scientific Name": String,
      "Watering Frequency": String,
      "Sunlight Preference": String,
    },
  ],
});
const User = mongoose.model("users", userSchema);

const dbURI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Plantly API"); // You can customize the message
});

// Register a new user
app.post("/signup", async (req, res) => {
  const newUser = {
    username: req.body["username"],
    email: req.body["email"],
    password: await bcrypt.hash(req.body["password"], 10),
  };

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username: newUser.username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email: newUser.email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // If no duplicates found, insert the new user
    const result = await User.insertMany([newUser]);
    console.log(result);
    const token = jwt.sign({ userId: newUser.username }, process.env.SECRET_KEY);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while signing up." });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "User not found." });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password." });
  }
  const token = jwt.sign({ userId: user.username }, process.env.SECRET_KEY);
  res.status(200).json({ token });
});

// Get first plant in the database
app.get("/getPlant", async (req, res) => {
  try {
    const plant = await Plant.findOne();
    console.log("Plant:", plant);
    res.send(plant);
  } catch (error) {
    console.error(error);
  }
});

// push new plant into database
app.post("/addUserPlant", async (req, res) => {
  try {
  // Get the user's ID from the token (you need to implement this)
  const token = req.headers.token; 
  const decodedusername = jwt.decode(token);
  const userId = decodedusername["userId"];

  const plantData = await Plant.findOne({ "Common Name": req.body.commonName });
  console.log("Plant Data:", plantData);

  // Create a new plant object
 const newPlant = {
  "Common Name": req.body.commonName,
  "Display Name": req.body.displayName,
  "Age": req.body.age,
  "Icon": req.body.icon,
  "Scientific Name": plantData["Scientific Name"],
  "Watering Frequency": plantData["Watering Frequency"],
  "Sunlight Preference": plantData["Sunlight Preference"],
 };
 console.log("New Plant:", newPlant)

  const updatedUser = await User.findOneAndUpdate({ username: userId }, { $push: { plants: newPlant } }, { new: true });
    if (updatedUser) {
      console.log("Updated User:", updatedUser);
      res.status(200).json(updatedUser);
    } else {
      console.log("No matching user found.");
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while adding the plant." });
  }
});

app.delete("/removeUserPlant", async (req, res) => {
  try {
    // Get the user's ID from the token
    const token = req.headers.token;
    const decodedUsername = jwt.decode(token);
    const userId = decodedUsername["userId"];

    const commonNameToRemove = req.body.commonName; // The Common Name of the plant to be removed

    const updatedUser = await User.findOneAndUpdate(
      { username: userId },
      { $pull: { plants: { "Common Name": commonNameToRemove } } },
      { new: true }
    );

    if (updatedUser) {
      console.log("Updated User:", updatedUser);
      res.status(200).json(updatedUser);
    } else {
      console.log("No matching user found.");
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the plant." });
  }
});

app.get("/getUserUsername", async (req, res) => {
  try {
    // Decode the token to get the username
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.userId;
    console.log("Username!:", username);

    // Use the username to get the user details
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the user's username
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error fetching user's username:", error);
    res.status(500).json({ error: "Error fetching user's username." });
  }
});

app.get("/getUserPlants", async (req, res) => {
  try {
    // Decode the token to get the username
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.userId;
    console.log("Username:", username);

    // Use the username to get the user details
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the plants field of the user
    res.status(200).json({ plants: user.plants });
  } catch (error) {
    console.error("Error fetching user's plants:", error);
    res.status(500).json({ error: "Error fetching user's plants." });
  }
});


// Ensure the database is connected before starting the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
