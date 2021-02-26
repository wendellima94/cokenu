import {Request, Response} from "express";
import {Authenticator} from "../services/Athenticator";
import {UserDatabase} from "../data/UserDatabase";
import {UsersRelationDatabase} from "../data/UsersRelationDatabase";
import {BaseDatabase} from "../data/BaseDatabase";

export const followUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const userToFollowId = req.body.userToFollowId;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);
    const userId = authenticationData.id;

    if(!userToFollowId) {
      throw new Error('Insira um id válido')
    }

    const userDataBase = new UserDatabase();
    const user = await userDataBase.getUserById(userToFollowId);

    if(!user) {
      throw new Error('Usuário não existe')
    }

    const usersRelationDatabase = new UsersRelationDatabase();
    await usersRelationDatabase.followUser(
      userId,
      userToFollowId
    );

    res.status(200).send({
      message: 'Usuário seguido com sucesso'
    })
  } catch (e) {
    res.status(400).send({
      message: e.message
    })
  }
  await BaseDatabase.destroyConnection();
};