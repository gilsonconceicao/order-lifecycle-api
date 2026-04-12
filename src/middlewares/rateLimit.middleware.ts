import rateLimit from "express-rate-limit";

const fifteenMinutes = 15 * 60 * 1000;

export const rateLimitMiddleware = 
rateLimit({
  windowMs: fifteenMinutes,
  max: 100,
  message: {
    statusCode: 429, 
    code: "RATE_LIMIT_EXCEEDED",
    message: "Limite de requisições excedido. Tente novamente mais tarde.",
  },
  standardHeaders: true, 
  legacyHeaders: false
});
