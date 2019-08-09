


export const getPrices = () => {
    return fetch('http://fairbanks.io:7001/api/v1/spots/latest')
    .then(response => response.json())
    .catch(error =>{
      console.error(error);
    });
}