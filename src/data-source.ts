import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./data/entity/User"
import {BlogPost} from "./data/entity/Blog"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "_XPresent@1$",
    database: "mediblog",
    synchronize: true,
    logging: false,
    entities: [User, BlogPost],
    migrations: [],
    subscribers: [],
})
