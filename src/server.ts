import dotenv from "dotenv";
import { app } from "./app";
import { AppDataSource } from "./infrastructure/database/data-source";
import { startJobs } from "./shared/jobs";
import { verifyNodemailerCheck } from "./shared/utils";

dotenv.config();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("Database is connected");
    if (process.env.ENABLE_CRON_JOBS) {
      startJobs();
    }
    if (process.env.ENABLE_CHECK_SMTP_SERVICE) {
      await verifyNodemailerCheck()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch(console.error);
