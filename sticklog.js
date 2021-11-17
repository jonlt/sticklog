
const verbosityLevel = {
    none: 0,
    fatal: 1,
    error: 2,
    warn: 3,
    info: 4,
    debug: 5,
    trace: 6,
}

function Logger(loggerConfig) {

    const getVerbosityLevel = (level) => {
        return loggerConfig.levels[level];
    }

    const log = (level, data) => {
        if (loggerConfig.verbosity >= level) {
            const currentVerbosityLevel = getVerbosityLevel(level);

            if (loggerConfig.coloredConsole) {
                process.stdout.write(currentVerbosityLevel.color);
            }

            if (loggerConfig.includeTimestamp) {
                process.stdout.write(new Date().toISOString());
                process.stdout.write('|');
            }

            process.stdout.write(currentVerbosityLevel.name);
            process.stdout.write('|');
            if (loggerConfig.name) {
                process.stdout.write(loggerConfig.name);
                process.stdout.write('|');
            }

            currentVerbosityLevel.log(...data);

            if (loggerConfig.coloredConsole) {
                // reset color
                process.stdout.write('\u001b[0m')
            }
        }
    }

    return {
        trace: (...data) => {
            log(verbosityLevel.trace, data);
        },
        debug: (...data) => {
            log(verbosityLevel.debug, data);
        },
        info: (...data) => {
            log(verbosityLevel.info, data);
        },
        warn: (...data) => {
            log(verbosityLevel.warn, data);
        },
        error: (...data) => {
            log(verbosityLevel.error, data);
        },
        fatal: (...data) => {
            log(verbosityLevel.fatal, data);
        },
        config: loggerConfig,
    }
}

const createConfig = (name, verbosity) => {
    return {
        name: name,
        verbosity: verbosity ?? verbosityLevel.debug,
        coloredConsole: true,
        includeTimestamp: true,
        levels: [
            {
                level: verbosityLevel.none,
                name: 'NONE',
                color: '',
                log: () => { }
            },
            {
                level: verbosityLevel.fatal,
                name: 'FATAL',
                color: '\u001b[37m\u001b[41m',
                log: console.error,
            },
            {
                level: verbosityLevel.error,
                name: 'ERROR',
                color: '\u001b[31m',
                backgroundColor: '',
                log: console.error,
            },
            {
                level: verbosityLevel.warn,
                name: 'WARN',
                color: '\u001b[33m',
                log: console.warn,
            },
            {
                level: verbosityLevel.info,
                name: 'INFO',
                color: '\u001b[32m',
                log: console.info,
            },
            {
                level: verbosityLevel.debug,
                name: 'DEBUG',
                color: '',
                log: console.debug,
            },
            {
                level: verbosityLevel.trace,
                name: 'TRACE',
                color: '\u001b[36m',
                log: console.trace,
            },
        ]
    }
}

let loggers = {};
const getLogger = (name, verbosity) => {
    name = name ?? "";
    if (!loggers[name]) {
        const config = createConfig(name, verbosity)
        const logger = new Logger(config);
        loggers[name] = logger;
    }

    return loggers[name];
}

exports.verbosity = verbosityLevel;
exports.getLogger = getLogger;
