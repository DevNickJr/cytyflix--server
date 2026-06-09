import env from "@/configs/env.config"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    entities: [
        __dirname + "/modules/**/infrastructure/persistence/*.entity.{js,ts}"
    ],
    // entities: [__dirname + "/entities/**/*{.js,.ts}"],
    logging: true,
    synchronize: env.NODE_ENV === "development", // true for devmode
})