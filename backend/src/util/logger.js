import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors, json } = format;

const upperCaseLevel = format((info) => {
    info.level = info.level.toUpperCase();
    return info;
});

const consoleFormat = printf(({ timestamp, level, message, stack }) => {
    return stack 
        ? `${timestamp} [${level}]: ${message}\nStack: ${stack}`
        : `${timestamp} [${level}]: ${message}` ;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        upperCaseLevel(),
    ),
    transports: [
        new transports.Console({
            level: "debug",
            format: combine (
                colorize({ level: true }),
                consoleFormat,
            ),
        }),
    ]
})

const fileRotateTransport = new DailyRotateFile({
    filename: "logs/application-%Date%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
    format: combine(
        timestamp(),
        errors({ stack: true }),
        json(),
    ),
});

logger.add(fileRotateTransport);

export default logger;