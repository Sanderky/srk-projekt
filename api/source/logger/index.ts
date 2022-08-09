import pino from 'pino'

const log = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: true
        }
    }
});

export default log;