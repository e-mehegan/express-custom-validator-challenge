const express = require('express');
// Create the server instance.
const app = express();
// Configure the server instance to receive JSON data.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// PokeAPI 
const baseURL = "https://pokeapi.co/api/v2/pokemon/";

const isPokemonValid = async (request, response, next) => {
    // If fetch request returns JSON, store as object
    await fetch(baseURL + request.body.pokemonName).then(async (data) => {
        // Response data to string
        let dataText = await data.text();
        
        // Check PokeAPI error
        if (dataText == "Not Found") {
            // Provide error message if Pokemon not found
            next(new Error("Pokemon is not found."));
        } else {
            // If valid will execute this 
            request.body.pokeApiResult = JSON.parse(dataText);
            // Move to next function
            next()
        }
        
    })
}

// Declare error handlers last in the middleware declarations
const handleInvalid = (error, request, response) => {
    if (error){
        console.log(error.message);
        response.status(400).json({
            error: error.message
        });
    }
}

// Will execute if data is on body: Pokedex number and Name will show
app.post('/', isPokemonValid, handleInvalid ,async (request, response) => {
    response.json({
        pokedexNumber: request.body.pokeApiResult.id,
        name: request.body.pokeApiResult.name
    });
});


// Activate server at port 3000.
app.listen(3000, () => {
    console.log("Server running!");
});