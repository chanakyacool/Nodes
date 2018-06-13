#!/usr/bin/env node
const yargs = require('yargs');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
        demand: true,
        alias: 'address',
        describe: 'Address to fetch weather for',
        string: true
      }
  })
   .help()
   .alias('help', 'h')
   .argv;

 geocode.geocodeAddress(argv.address, (errorMessage, results) => {
  if (errorMessage){
    console.log(errorMessage);
  } else {
    console.log(results.address);
    // lat , lng, callback(errorMessage, results)
    var lat = results.latitude;
    var lng = results.longitude;
    weather.getWeather(lat, lng, (errorMessage, weatherResults) => {
      if (errorMessage){
      console.log(errorMessage);
        } else {
        // console.log(JSON.stringify(weatherResults, undefined, 2));
        console.log(`Its currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}`)
      } 
    });
  }
 });

