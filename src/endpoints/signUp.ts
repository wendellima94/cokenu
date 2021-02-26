import {Request, Response} from "express";
import {IdGenerator} from "../services/IdGenerator";
import {HashManager} from "../services/HashManager";
import {UserDatabase} from "../data/UserDatabase";
import {Authenticator} from "../services/Athenticator";
import {BaseDatabase} from "../data/BaseDatabase";

export const signUp = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

  if(!name || !email || !password) {
    throw new Error('Insira todas as informações necessárias para o cadastro');
  }

  if(password.length < 6) {
    throw new Error('A senha deve conter no mínimo seis caracteres')
  }

  const idGenerator = new IdGenerator();
  const id = idGenerator.generateId();

  const hashManager = new HashManager();
  const hashPassword = await hashManager.hash(password);

  const userDataBase = new UserDatabase();
  await userDataBase.registerUser(
    id,
    name,
    email,
    hashPassword
  );

  const authenticator = new Authenticator();
  const token = authenticator.generateToken({id});

  res.status(200).send({
    message: 'Usuário criado com sucesso',
    token
  });
  } catch (e) {
  res.status(400).send({
    message: e.message
  })
  }
  await BaseDatabase.destroyConnection();
};