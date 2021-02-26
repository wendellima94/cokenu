import {Request, Response} from "express";
import {BaseDatabase} from "../data/BaseDatabase";
import {Authenticator} from "../services/Athenticator";
import {RecipeDatabase} from "../data/RecipeDatabase";
import moment from 'moment';

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const recipeId = req.params.id as any;

    const authenticator = new Authenticator();
    authenticator.verify(token);

    const recipeDatabase = new RecipeDatabase();
    const recipe = await recipeDatabase.getRecipeById(recipeId);

    const recipeDate = moment(recipe.createdAt).format('DD/MM/YYYY');

    res.status(200).send({
      id: recipe.recipe_id,
      title: recipe.title,
      description: recipe.description,
      createdAt: recipeDate
    })
  } catch (e) {
    res.status(400).send({
      message: e.message
    })
  }
  await BaseDatabase.destroyConnection();
};