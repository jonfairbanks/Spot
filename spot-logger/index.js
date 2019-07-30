const express = require('express');
const app = express();
const port = process.env.PORT || 7000;

const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.listen(port, () =>
  console.log(`Spot-logger is running on port ${port}!`),
);
