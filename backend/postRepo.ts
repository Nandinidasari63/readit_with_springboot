import { ObjectId } from "mongodb";
import { postsCollection } from "./db/client.ts";
import { type Post } from "../frontend/src/reducer.tsx";

export class PostManager {
  async getPosts() {
    return await postsCollection.find({}).toArray();
  }

  async addPost(data: Post) {
    return await postsCollection.insertOne({
      ...data,
      createdAt: new Date(),
    });
  }

  async removePost(id: string) {
    return await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
