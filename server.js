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

app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./data/blacksky.json');
    const forecastData = getWeather(weatherData);
    response.send(forecastData);
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

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = timeConverter(time);
}

function getWeather(weatherData) {
  let result = [];
  weatherData.daily.data.forEach(element => {
    result.push (new Weather (element.summary, element.time));
  });
  return result;
}

function errorHandler (error, request, response) {
  response.status(500).send(error);
}

function timeConverter(unixTimeStamp) {
  let dateObj = new Date(unixTimeStamp * 1000);
  let utcString = dateObj.toUTCString();
  return utcString.slice(0, 16);
}


//Ensure that the server is listening for requests
//THIS MUST BE AT THE BOTTOM OF THE FILE
app.listen(PORT, () => console.log(`The server is up listening on ${PORT}`));
