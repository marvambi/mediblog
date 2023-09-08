import asyncHandler from "express-async-handler";
import { User } from "../data/entity/User";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";

const authr = asyncHandler(async (req: any, res: any, next) => {

    const userRepository = AppDataSource.getRepository(User)

  try {
    const { token } = req.cookies;

    if (!token) {
      // eslint-disable-next-line max-len
      return res
        .status(401)
        .send({ message: "No authorization token, please login" });
    }

    // Verify Token
    const verified: any = jwt.verify(token, "5ytjjfbPK8ZJ");
    // Get user id from token
    // es-lint disable next line

    const id = verified?.id

    const user = await userRepository.query("SELECT email, password FROM user WHERE id = " + `${id}`);

    if (!user) {
      return res
        .status(401)
        .send({ message: "User not found, please register" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
});

export default authr;