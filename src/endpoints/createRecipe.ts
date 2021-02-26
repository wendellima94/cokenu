import {Request, Response} from "express";
import {BaseDatabase} from "../data/BaseDatabase";
import {Authenticator} from "../services/Athenticator";
import {IdGenerator} from "../services/IdGenerator";
import {RecipeDatabase} from "../data/RecipeDatabase";

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);
    const userId = authenticationData.id;

    const idGenerator = new IdGenerator();
    const recipeId = idGenerator.generateId();

    const {title, description} = req.body;
    const creationDate = Date.now();

    const recipeDatabase = new RecipeDatabase();
    await recipeDatabase.createRecipe(
      recipeId,
      userId,
      title,
      description,
      creationDate
    );
    res.status(200).send({
      message: 'Receita criada com sucesso'
    })
  } catch (e) {
    res.status(400).send({
      message: e.message
    })
  }
  await BaseDatabase.destroyConnection();
};