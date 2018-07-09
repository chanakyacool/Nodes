const axios = require('axios');

const getExchangeRate = async (from, to) => {
  // EU Exchange rates
  try {
    const response = await axios.get('http://data.fixer.io/api/latest?access_key=d4bcf7cf64efc633f2088a1c590de0c0&format=1');
    const rate =  response.data.rates[to];
    if(rate) {
      return rate;
    } else {
      throw new Error();
    }
  } catch (e) {
    throw new Error(`Unable to get the exchange rate for ${from} and ${to}`)
  }
}


const getCountries = async (currencyCode) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return response.data.map((country) => country.name);
  } catch (e) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
}


const convertCurrency = async (from ,to , amount) => {
  const exchangeRate = await getExchangeRate(from, to);
  const countries = await getCountries(to);
  const exchangedAmount = amount * exchangeRate;
  return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used to convert in other countries like: ${countries}`
}


convertCurrency('EUR', 'INR', 1).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e.message);
})