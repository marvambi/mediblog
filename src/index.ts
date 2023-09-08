import express, { Request, Response } from "express"
import * as bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./data/entity/User"
import crypto  from "node:crypto"
import * as dotenv from "dotenv";
import {BlogPost} from "./data/entity/Blog"

/**
     * hash password with utility with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
export function secure(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

AppDataSource.initialize().then(async () => {
    // init dotenv
    dotenv.config();
    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    
    const { APP_SALT, APP_PORT } = process.env;

    // start express server
    app.listen(APP_PORT || 3001)

    await AppDataSource.manager.clear(User)

    // insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Marvin",
            lastName: "Ambrose",
            email: "marvambi@gmail.com",
            password: secure("Eniolo@11X", APP_SALT).passwordHash
        })
    )

    // insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(BlogPost, {
            title: "Marvin",
            description: "Ambrose Blog Post",
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(BlogPost, {
            title: "Independence and Unity",
            description: "For the good of Humanity and the Federation",
        })
    )

    console.log(`Express server has started on port ${APP_PORT}. Open http://localhost:${APP_PORT}/users to see results`)

}).catch(error => console.log(error))
