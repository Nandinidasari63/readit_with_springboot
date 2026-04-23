import { ObjectId } from "mongodb";
import { postsCollection } from "./db/client.ts";
import { type Post } from "../frontend/src/reducer.tsx";

export class PostManager {
  async getPosts(userId: string | undefined) {
    return (await postsCollection.find({ _id: new ObjectId(userId) })
      .toArray())[0];
  }

  async addPost(data: Post, name: string | undefined) {
    return await postsCollection.updateOne({ name: name }, {
      $push: { posts: data },
    });
  }

  async addUser({ name, password }: { name: string; password: string }) {
    return await postsCollection.insertOne({
      name,
      password,
      posts: [],
    });
  }

  async removePost(id: number, userId: string) {
    console.log(
      await postsCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { posts: { id: id } } },
      ),
    );
    await postsCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { posts: { id: id } } },
    );
  }
}
