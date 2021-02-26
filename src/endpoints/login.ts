import {Request, Response} from "express";
import {BaseDatabase} from "../data/BaseDatabase";
import {UserDatabase} from "../data/UserDatabase";
import {HashManager} from "../services/HashManager";
import {Authenticator} from "../services/Athenticator";

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userDataBase = new UserDatabase();
    const user = await userDataBase.getUserByEmail(email);

    const hashManager = new HashManager();
    const isPasswordCorrect = await hashManager.compare(password, user.password);

    if(!isPasswordCorrect) {
      throw new Error('Usuário ou senha errados');
    }

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id: user.id
    });

    res.status(200).send({
      message: 'Usuário logado com sucesso',
      token
    })
  } catch (e) {
    res.status(400).send({
      message: e.message
    })
  }
  await BaseDatabase.destroyConnection();
};