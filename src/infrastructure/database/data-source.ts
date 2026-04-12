import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { env } from "../../config/env"


export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.dbHost,
  port: Number(env.dbPort),
  username: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,

  synchronize: false,
  logging: true,

  entities: ["src/modules/**/*.entity.ts"],
  migrations: ["src/infrastructure/database/migrations/*.ts"]
})