import {Request, Response} from "express";
import {BaseDatabase} from "../data/BaseDatabase";
import {Authenticator} from "../services/Athenticator";
import {UserDatabase} from "../data/UserDatabase";

export const getUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const id = req.params.id as any;

    const authenticator = new Authenticator();
    authenticator.verify(token);

    const userDataBase = new UserDatabase();
    const user = await userDataBase.getUserById(id);

    res.status(200).send({
      userName: user.name,
      userEmail: user.email,
      userId: user.id
    })
  } catch (e) {
  res.status(400).send({
    message: e.message
  })
  }
  await BaseDatabase.destroyConnection();
};