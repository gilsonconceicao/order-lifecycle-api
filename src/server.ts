import dotenv from "dotenv";
import { app } from "./app";
import { AppDataSource } from "./infrastructure/database/data-source";
import { setupCronScheduleJobs } from "./shared/jobs";
import { logger } from "./config";

dotenv.config();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    logger.info("Database is connected")
    
    if (process.env?.ENABLE_CRON_JOBS === 'true') {
      setupCronScheduleJobs();
    }

    app.listen(PORT, () => {
      logger.info(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`${error}`)
  });
