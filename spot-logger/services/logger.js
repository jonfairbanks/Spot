const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: process.env.LOG_LOCATION || 'spot-logger.log' }),
  ],
});

module.exports = logger;

