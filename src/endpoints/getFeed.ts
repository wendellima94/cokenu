import {Request, Response} from "express";
import {BaseDatabase} from "../data/BaseDatabase";
import {Authenticator} from "../services/Athenticator";
import {FeedDatabase} from "../data/FeedDatabase";
import moment from "moment";

export const getFeed = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);
    const userId = authenticationData.id;

    const feedDatabase = new FeedDatabase();
    const feed = await feedDatabase.getFeed(userId);
    const mappedFeed = feed.map((item: any) => ({
      id: item.recipe_id,
      title: item.title,
      description: item.description,
      createdAt: moment(item.createdAt).format('DD/MM/YYYY'),
      userId: item.id,
      userName: item.name
    }));
    res.status(200).send(mappedFeed);
  } catch (e) {
    res.status(400).send({
      message: e.message
    })
  }
  await BaseDatabase.destroyConnection();
};