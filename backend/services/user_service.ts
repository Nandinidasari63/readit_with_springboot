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

  async getUsersByIds(userIds: string[]) {
    if (!userIds.length) return [];
    const objectIds = userIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    return await usersCollection.find({ _id: { $in: objectIds } }).toArray();
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { avatarUrl } },
    );
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
