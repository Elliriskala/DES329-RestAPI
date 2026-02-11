const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const {success, getUniqueId} = require('./helper.js')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

app
  .use(morgan('dev'))
  .use(bodyParser.json())


app.get('/', (req,res) => res.send('Hello World ;)'))

app.get('/api/pokemon/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    
    if (!pokemon) {
        return res.status(404).json({ message: "Le pokemon n'existe pas" });
    }
    
    const message = 'un pokemon a bien été trouvé'
    res.json(success(message, pokemon))
})

app.get('/api/pokemons', (req, res) => {
    const message = 'la liste des pokemons a bien été récuperé'
    res.json(success(message, pokemons))
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body,...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
})



app.listen(port, () => console.log(`notre application node est démarée sur : http://localhost:${port}`))