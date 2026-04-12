import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/routes";
import swaggerUi from "swagger-ui-express"
import { specs } from "./swagger";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimitMiddleware);

app.use("/api", routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export { app };
