import env from "@/configs/env.config"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    entities: [
        __dirname + "/../../modules/**/infrastructure/persistence/*.orm-entity.{js,ts}"
    ],
    logging: env.NODE_ENV === "development",
    synchronize: env.NODE_ENV === "development",
})
