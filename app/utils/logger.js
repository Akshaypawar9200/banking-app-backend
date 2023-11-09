const winston = require('winston');
const packageJson = require('../../package.json');
const packageName = packageJson.name;

function initLogger(logLevel) {
  if (!logLevel) 
    throw new Error("logLevel value is Empty")
  const Logger = winston.createLogger(
    {
      exitOnError: false,
      level: logLevel,
      format: winston.format.combine(
        winston.format.label({
          label: packageName,
        }),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.printf(
          (info) => {
            let logStructure = `${info.level}: ${info.label}: ${[info.timestamp]}: `;
  
            if (info.requestId)logStructure += `${info.requestId}: `;
  
            logStructure += `${info.message}`;
  
            return logStructure;
          },
        ),
      ),
      transports: [new winston.transports.Console()],
    },
  );

  return Logger;
}

module.exports = {
  initLogger
};

// const childLogger = logger.child({ requestId: '1234' });

// childLogger.error('Logs: error');
// childLogger.warn('Logs: warn');
// childLogger.info('Logs: info');
// childLogger.http('Logs: http');
// childLogger.verbose('Logs: verbose');
// childLogger.debug('Logs: debug');
// childLogger.silly('Logs: silly');
