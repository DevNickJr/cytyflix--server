import { createLogger, format, transports } from 'winston';

const myformat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(info => `${info.timestamp} - ${info.level} - ${info.message}`)
);

const logger = createLogger({
  transports: [
    // new transports.File({
    //   filename: 'src/logs/error.log',
    //   format: myformat,
    // }),
    new transports.Console({
      level: 'info',
      format: myformat,
    }),
  ],
});

export default logger;
