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

  async addUser(name: string, password: string) {
    const existing = await usersCollection.findOne({ name, password });

    if (existing) return { user: existing, isNew: false };

    const res = await usersCollection.insertOne({ name, password });

    return {
      user: {
        _id: res.insertedId.toString(),
        name,
        password,
      },
      isNew: true,
    };
  }
}
