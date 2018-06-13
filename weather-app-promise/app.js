#!/usr/bin/env node
const yargs = require('yargs');
const axios = require('axios');

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

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
  if(response.data.status == 'ZERO_RESULTS'){
    throw new Error('Unable to find that address');
  }

  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherURL = `https://api.darksky.net/forecast/7db71aabf2e2894a09fbc60aac93619d/${lat}, ${lng}`
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherURL);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`Its currently ${temperature}. It feels like ${apparentTemperature}`);
}).catch((error) => {
  if(error.code === 'ENOTFOUND'){
    console.log('Unable to connect to api server');
  } else {
    console.log(error.message);
  }
});
