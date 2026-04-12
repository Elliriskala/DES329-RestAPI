const mongoose = require("mongoose");
const { Pokemon } = require("./helper.js");
require("dotenv").config();

const pokemons = [
  {
    name: "Bulbasaur",
    hp: 25,
    cp: 5,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
    types: ["Grass", "Poison"]
  },
  {
    name: "Charmander",
    hp: 28,
    cp: 6,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png",
    types: ["Fire"]
  },
  {
    name: "Squirtle",
    hp: 21,
    cp: 4,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/007.png",
    types: ["Water"]
  },
  {
    name: "Weedle",
    hp: 16,
    cp: 2,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/013.png",
    types: ["Bug", "Poison"]
  },
  {
    name: "Pidgey",
    hp: 30,
    cp: 7,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/016.png",
    types: ["Normal", "Flying"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pokemon");
    console.log("Connected to MongoDB");

    // Clear existing data
    await Pokemon.deleteMany({});
    console.log("Database cleared");

    // Insert seed data
    const result = await Pokemon.insertMany(pokemons);
    console.log(`${result.length} pokemons added to database`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();
