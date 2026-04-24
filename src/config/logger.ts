import pino from "pino";

const isEnvProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: !isEnvProduction
    ? () =>
        `,"time":"${new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })}"`
    : pino.stdTimeFunctions.isoTime,
  transport: !isEnvProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      id: req.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: ["req.headers.authorization", "password", "token"],
    censor: "***",
  },
});
