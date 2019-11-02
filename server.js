'use strict';

//load Environment veriable from the .env
require('dotenv').config();

//declare Application Dependencies
const express = require('express');
const cors = require('cors');

//Application setup
const PORT = process.env.PORT;
const app = express(); //convention, just so that it looks better
app.use(cors());

//route syntax = app.<operation>('<route>', callback);
app.get('/', (request, response) => {
  response.send('Home page');
});

app.get('/bad', (request, response) => {
  throw new Error('bummer');
});

app.get('/about', aboutUsHandler);

// app.get('*', (request, response) => {
//   response.status(404).send('This page does not exist');
// });

function aboutUsHandler (request, response) {
  response.status(200).send('This is the About us page');
}


//API routes
app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.data;
    const locationData = new Location(city, geoData);
    response.send(locationData);
  }
  catch(error) {
    //some function or error message
    errorHandler('Sorry, something went wrong', request, response);
  }
});

//Helper functions
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function errorHandler (error, request, response) {
  response.status(500).send(error);
}

//Ensure that the server is listening for requests
//THIS MUST BE AT THE BOTTOM OF THE FILE
app.listen(PORT, () => console.log(`The server is up listening on ${PORT}`));
