/**
 * Client-side Logger
 * Provides logging functionality with different levels
 */

class Logger {
  static LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };

  static currentLevel = Logger.LOG_LEVELS.INFO;

  static setLevel(level) {
    this.currentLevel = level;
  }

  static formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...(data && { data }),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    return logData;
  }

  static log(level, levelName, message, data = null) {
    if (level < this.currentLevel) return;

    const logData = this.formatMessage(levelName, message, data);

    // Console output with appropriate styling
    const styles = {
      DEBUG: 'color: #6b7280',
      INFO: 'color: #2563eb',
      WARN: 'color: #f59e0b',
      ERROR: 'color: #ef4444; font-weight: bold'
    };

    console.log(
      `%c[${logData.timestamp}] ${levelName}: ${message}`,
      styles[levelName],
      data || ''
    );

    // In production, you might want to send logs to a server
    if (level >= Logger.LOG_LEVELS.ERROR) {
      this.sendToServer(logData);
    }
  }

  static debug(message, data = null) {
    this.log(this.LOG_LEVELS.DEBUG, 'DEBUG', message, data);
  }

  static info(message, data = null) {
    this.log(this.LOG_LEVELS.INFO, 'INFO', message, data);
  }

  static warn(message, data = null) {
    this.log(this.LOG_LEVELS.WARN, 'WARN', message, data);
  }

  static error(message, data = null) {
    this.log(this.LOG_LEVELS.ERROR, 'ERROR', message, data);
  }

  static async sendToServer(logData) {
    // Send critical logs to server
    try {
      // Uncomment when backend is ready
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logData)
      // });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  static logUserAction(action, details = {}) {
    this.info(`User Action: ${action}`, details);
  }

  static logPageView(pageName) {
    this.info(`Page View: ${pageName}`, {
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  static logError(error, context = '') {
    this.error(`Error in ${context}`, {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
}

// Make it available globally
window.Logger = Logger;

// Set development mode based on hostname
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  Logger.setLevel(Logger.LOG_LEVELS.DEBUG);
  Logger.debug('Logger initialized in DEBUG mode');
} else {
  Logger.setLevel(Logger.LOG_LEVELS.INFO);
}

export default Logger;
