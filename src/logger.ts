import pino from "pino";
import env from "./config/manejo_VE";

const isDev = env.isDev !== 'produccion'

const logger = pino({
  name: 'noticias',
  level: isDev ? 'debug' : 'info',
  base: isDev ? { env: env.isDev } : null,
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'mensaje',
  errorKey: 'error',
  formatters: {
    level(label) {
      return { nivel: label };
    },
    // bindings(bindings) {
    //   return { pid: bindings.pid };
    // },
    log(object) {
      return object;
    }
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});

export default logger
