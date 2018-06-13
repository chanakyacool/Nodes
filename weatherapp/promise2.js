var geocode = require('./geocode/geocode');

var geoCodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      geocode.geocodeAddress(address, (errorMessage, results) => {
        if(errorMessage){
          reject(errorMessage);
        } else {
          resolve(results);
        };
      });
    }, 1500)
  })
}

geoCodeAddress('19146').then((location)=>{
  console.log(JSON.stringify(location, undefined, 2));
}, (errorMessage) => {
  console.log(errorMessage);
});