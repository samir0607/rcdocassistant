// For this example you need the node-fetch npm packages: `npm i node-fetch`
import fetch from 'node-fetch';

fetch('https://api.scraperapi.com/?api_key=4d317457811fe369d2cd942d178ab86c&url=https%3A%2F%2Fdeveloper.rocket.chat%2Fdocs%2Fslash-commands')
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error)
  });
