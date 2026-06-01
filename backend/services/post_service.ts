import { ObjectId } from "mongodb";
import { postsCollection } from "../db/client.ts";

export class PostService {
  async getPostsByUsers(userIds: string[]) {
    if (!userIds.length) return [];

    const posts = await postsCollection
      .find({ userId: { $in: userIds } })
      .sort({ time: -1 })
      .toArray();

    return posts.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));
  }

  async addPost(
    data: { title: string | null; body: string | null; imageUrl?: string },
    userId: string,
    name: string,
  ) {
    if (!data.title && !data.body && !data.imageUrl) {
      throw new Error("Post cannot be empty");
    }

    const result = await postsCollection.insertOne({
      ...data,
      time: new Date().toISOString(),
      userId,
      name,
    });

    return result.insertedId.toString();
  }

  async deletePost(postId: string, userId: string) {
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid postId");
    }

    const result = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
      userId,
    });

    if (result.deletedCount === 0) {
      throw new Error("Post not found or unauthorized");
    }
  }
}
