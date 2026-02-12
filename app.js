const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { success, getUniqueId } = require("./helper.js");
let pokemons = require("./mock-pokemon");

const app = express();
const port = 3000;

app.use(morgan("dev")).use(bodyParser.json());

// test route

app.get("/", (req, res) => res.send("Hello World ;)"));

// get pokemon by id

app.get("/api/pokemon/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);

  if (!pokemon) {
    return res.status(404).json({ message: "The pokemon does not exist" });
  }

  const message = "A pokemon has been successfully found";
  res.json(success(message, pokemon));
});

// get all pokemons

app.get("/api/pokemons", (req, res) => {
  const message = "The list of Pokemons has been successfully found";
  res.json(success(message, pokemons));
});

// create a new pokemon

app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `The pokemon ${pokemonCreated.name} has been successfully created.`;
  res.json(success(message, pokemonCreated));
});

// update a pokemon by id

app.put("/api/pokemon/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let pokemon = pokemons.find((pokemon) => pokemon.id === id);
  if (!pokemon) {
    return res.status(404).json({ message: "The pokemon does not exist" });
  }

  pokemon = { ...pokemon, ...req.body };
  pokemons = pokemons.map((p) => (p.id === id ? pokemon : p));
  const message = `The pokemon ${pokemon.name} has been successfully updated.`;
  res.json(success(message, pokemon));
});

// delete a pokemon

app.delete("/api/pokemon/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);

  if (!pokemon) {
    return res.status(404).json({ message: "The pokemon does not exist" });
  }

  pokemons = pokemons.filter((p) => p.id !== id);
  const message = `The pokemon ${pokemon.name} has been successfully deleted.`;
  res.json(success(message, pokemon));
});

app.listen(port, () =>
  console.log(`node application running at : http://localhost:${port}`),
);
