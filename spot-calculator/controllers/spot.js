import { AsyncStorage } from 'react-native';
import {SPOT_API} from 'react-native-dotenv';

export const getPrices = () => {
  return fetch(SPOT_API + '/latest')
  .then(response => {
    if(response.status === 200) {
      return response.json()
    } else {
      console.log({status: response.status, url: response.url})
      return {}
    }
  })
  .catch(error =>{
    console.error(error);
  });
}

export const getChartData = () => {
  return fetch(SPOT_API + '/week')
  .then(response => {
    if(response.status === 200) {
      return response.json()
    } else {
      console.log({status: response.status, url: response.url})
      return {}
    }
  })
  .catch(error =>{
    console.error(error);
  });
}

export const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log('Formatting error: ' + e)
  }
}

export const getPortfolioWeightsFromStorage = () => {
  AsyncStorage.getItem("silverWeight").then((value) => {
    console.log("s: " + value)
    this.setState({silverWeight: value});
  }).done();

  AsyncStorage.getItem("goldWeight").then((value) => {
    console.log("g: " + value)
    this.setState({goldWeight: value});
  }).done();

  AsyncStorage.getItem("platinumWeight").then((value) => {
    console.log("pl: " + value)
    this.setState({platinumWeight: value});
  }).done();

  AsyncStorage.getItem("palladiumWeight").then((value) => {
    console.log("pa: " + value)
    this.setState({palladiumWeight: value});
  }).done();
}