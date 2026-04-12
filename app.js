const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { success } = require("./helper.js");
const { Pokemon } = require("./helper.js");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(morgan("dev"))
  .use(bodyParser.json())
  .use(express.static("public"));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pokemon");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// test route
app.get("/", (req, res) => res.send("Hello World ;)"));

// get pokemon by id
app.get("/api/pokemon/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);

    if (!pokemon) {
      return res.status(404).json({ message: "The pokemon does not exist" });
    }

    const message = "A pokemon has been successfully found";
    res.json(success(message, pokemon));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pokemon", error: error.message });
  }
});

// get all pokemons
app.get("/api/pokemons", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    const message = "The list of Pokemons has been successfully found";
    res.json(success(message, pokemons));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pokemons", error: error.message });
  }
});

// create a new pokemon
app.post("/api/pokemons", async (req, res) => {
  try {
    const pokemonCreated = new Pokemon(req.body);
    await pokemonCreated.save();
    const message = `The pokemon ${pokemonCreated.name} has been successfully created.`;
    res.json(success(message, pokemonCreated));
  } catch (error) {
    res.status(500).json({ message: "Error creating pokemon", error: error.message });
  }
});

// update a pokemon by id
app.put("/api/pokemon/:id", async (req, res) => {
  try {
    let pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) {
      return res.status(404).json({ message: "The pokemon does not exist" });
    }

    Object.assign(pokemon, req.body);
    await pokemon.save();
    const message = `The pokemon ${pokemon.name} has been successfully updated.`;
    res.json(success(message, pokemon));
  } catch (error) {
    res.status(500).json({ message: "Error updating pokemon", error: error.message });
  }
});

// delete a pokemon
app.delete("/api/pokemon/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);

    if (!pokemon) {
      return res.status(404).json({ message: "The pokemon does not exist" });
    }

    await Pokemon.findByIdAndDelete(req.params.id);
    const message = `The pokemon ${pokemon.name} has been successfully deleted.`;
    res.json(success(message, pokemon));
  } catch (error) {
    res.status(500).json({ message: "Error deleting pokemon", error: error.message });
  }
});

app.listen(port, () =>
  console.log(`node application running at : http://localhost:${port}`),
);
