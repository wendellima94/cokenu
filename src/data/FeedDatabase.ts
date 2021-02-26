import {BaseDatabase} from "./BaseDatabase";

export class FeedDatabase extends BaseDatabase {
  public async getFeed(userId: string): Promise<any> {
    const result = await this.getConnection().raw(`
      SELECT Recipes.recipe_id, title, description, createdAt, Users.id, Users.name
      FROM Recipes
      JOIN users_relation
      ON users_relation.user_to_follow_id = Recipes.user_id 
      AND users_relation.user_id = '${userId}'
      JOIN Users
      ON Recipes.user_id = Users.id;
    `);
    return result[0]
  }
}