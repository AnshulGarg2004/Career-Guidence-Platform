/**
 * Logging Middleware
 * Logs all incoming HTTP requests
 */

const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  logger.info('Incoming Request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request Completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

module.exports = loggerMiddleware;
