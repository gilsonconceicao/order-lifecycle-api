import dotenv from "dotenv";
import { app } from "./app";
import { AppDataSource } from "./infrastructure/database/data-source";
import { setupCronJobs } from "./shared/jobs";
import { checkSmtpConnection } from "./shared/utils";

dotenv.config();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("Database is connected");
    
    if (process.env?.ENABLE_CRON_JOBS === 'true') {
      setupCronJobs();
    }

    if (process.env?.ENABLE_CHECK_SMTP_CONNECTION === 'true') {
      await checkSmtpConnection()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch(console.error);
