import {Request, Response} from "express";
import {BaseDatabase} from "../data/BaseDatabase";
import {Authenticator} from "../services/Athenticator";
import {UserDatabase} from "../data/UserDatabase";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);

    const userDataBase = new UserDatabase();
    const user = await userDataBase.getUserById(authenticationData.id);

    res.status(200).send({
      userName: user.name,
      userEmail: user.email,
      userId: user.id
    })
  }catch (e) {
    res.status(400).send({
      message: e.message
    })
  }
  await BaseDatabase.destroyConnection();
};