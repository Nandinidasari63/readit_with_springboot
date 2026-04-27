import { ObjectId } from "mongodb";
import { usersCollection } from "../db/client.ts";

export class UserService {
  async getUser(userId: string) {
    return await usersCollection.findOne({
      _id: new ObjectId(userId),
    });
  }

  async getAllUsers() {
    const users = await usersCollection.find({}).toArray();

    return users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));
  }

  async findOrCreateGithubUser(name: string, githubId: number) {
    const user = await usersCollection.findOne({ githubId });

    if (user) return user;

    const res = await usersCollection.insertOne({
      name,
      githubId,
    });

    return {
      _id: res.insertedId.toString(),
      name,
      githubId,
    };
  }
}
