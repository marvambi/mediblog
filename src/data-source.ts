import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./data/entity/User"
import {BlogPost} from "./data/entity/Blog"
import * as dotenv from "dotenv";

dotenv.config();

const { APP_DB_USERNAME, APP_DB_PORT,APP_DB_DATABASE,APP_DB_PASSWORD, APP_DB_HOST } = process.env;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: APP_DB_HOST,
    port: parseInt(APP_DB_PORT),
    username: APP_DB_USERNAME,
    password: APP_DB_PASSWORD,
    database: APP_DB_DATABASE,
    connectTimeout: 30000,
    synchronize: true,
    logging: false,
    entities: [User, BlogPost],
    migrations: [],
    subscribers: [],
})
