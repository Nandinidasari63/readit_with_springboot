import { ObjectId } from "mongodb";
import { postsCollection } from "../db/client.ts";

export class PostService {
  async getPostsByUsers(userIds: string[]) {
    const posts = await postsCollection
      .find({ userId: { $in: userIds } })
      .toArray();

    return posts.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));
  }

  async addPost(
    data: {
      title: string | null;
      body: string | null;
      time: string;
    },
    userId: string,
    name: string,
  ) {
    const result = await postsCollection.insertOne({
      ...data,
      userId,
      name,
    });

    return result.insertedId.toString();
  }

  async deletePost(postId: string, userId: string) {
    await postsCollection.deleteOne({
      _id: new ObjectId(postId),
      userId,
    });
  }
}
