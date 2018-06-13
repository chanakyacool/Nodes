const request = require('request');

var getWeather = (lat, lng, callback) => {
request({url: `https://api.darksky.net/forecast/7db71aabf2e2894a09fbc60aac93619d/${lat}, ${lng}`, json: true }, (error, response, body) => {
    if(error){
      callback('Unable to connect Forecast.io servers');
    }else if (response.statusCode == 400){
     callback('Unable to fetch weather');
    }else if(response.statusCode === 200){
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    }
  });
};

module.exports = {getWeather};