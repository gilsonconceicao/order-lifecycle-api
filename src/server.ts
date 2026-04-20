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
    startJobs();
    await verifyNodemailerCheck()

    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  })
  .catch(console.error);
