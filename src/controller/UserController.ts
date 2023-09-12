import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../data/entity/User"
import { secure } from ".."
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import Res from "../middlewares/responses";
export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.query("SELECT id, firstName, lastName, email FROM user");
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.query("SELECT id, firstName, lastName, email FROM user WHERE id = " + `${id}`);

        if (!user.length) {
            return {message: `User with id: ${id} not found!`}
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = request.body;
        const {
            createHash
          } = await import('crypto');

        const hash = createHash('sha256');
        const { APP_SALT } = process.env;


        // const user = Object.assign(new User(), {
        //     firstName,
        //     lastName,
        //     email,
        //     password: secure(password, APP_SALT),
        // })

        return this.userRepository.query("INSERT INTO user (firstName, lastName, email, password) VALUES (" + `"${firstName}", "${lastName}", "${email}", "${secure(password, APP_SALT).passwordHash}"` + ")");
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.query("SELECT id, firstName, lastName, email FROM user WHERE id = " + `${id}`);

        if (!userToRemove.length) {
            return {message: "This user not exist"}
        }

        await this.userRepository.query("DELETE FROM user WHERE id = " + `${id}`);

        return {message: "User has been removed"};
    }


    async signIn(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;
        const {
            createHash
          } = await import('crypto');

        const hash = createHash('sha256');
        const { APP_SALT, JWT_SECRET } = process.env;

        // eslint-disable-next-line max-len
        const secretz: any = JWT_SECRET;
        // Generate Token
        const generateToken = (id: string) => {
            return jwt.sign({ id }, secretz, { expiresIn: "1d" });
        };
        let salt: string;
        const hashPassword = (password: string) => {
        salt = crypto.randomBytes(16).toString("hex");

        // Hashing salt & password with 100 iterations, 64 length and sha512 digest
        return crypto.pbkdf2Sync(password, salt, 100, 64, `sha512`).toString(`hex`);
        };
        password_hash: secure(password, APP_SALT);



    }

    // Generate Token
    generateToken = (id: string) => {
        // Validate multiple login session
        const { JWT_SECRET } = process.env;
        return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
    };
    
    // Login User
    async login(req: Request, res: Response, next: NextFunction) {
        const { JWT_SECRET, APP_SALT } = process.env;
        try {
            const { email, password } = req.body;
    
            // Validate Request
            if (!email || !password) {
                res.status(400).send({message: "Please add email and password"});
                return;
            }

            let verified: any;
        
            // Check if user exists
            const user = await this.userRepository.query("SELECT * FROM user WHERE email = " + `"${email}"`);
        
            if (!user.length) {
                res.status(400).send({
                message: "User not found, please signup",
                });
                return
            }
        
            // User exists, check if password is correct
        
            const hash = secure(password, APP_SALT);;
        
            if (user && hash.passwordHash === user[0].password) {
                const { id, email } = user[0];
        
                //   Generate Token
                const token = this.generateToken(id);
        
                // Send HTTP-only cookie
                res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400), // 1 day
                sameSite: "none",
                secure: true,
                });
        
                res.status(200).send({
                    message:"Logged in successfully",
                });
                return;
            } else {
                res.status(400).send({ message: "Invalid email or password" });
                return;
            }
        } catch (error: any) {
            console.log("Error: ", error);
            res.status(500).send({message: error});
            return;
        }
    };

    // Logout User
    async logout (_req: Request, res: Response): Promise<any> {
        res.cookie("token", "", {
            path: "/",
            httpOnly: true,
            expires: new Date(0),
            sameSite: "none",
            secure: true,
        });
        res.status(200).send({ message: "Successfully Logged Out" });
        return;
    }
}