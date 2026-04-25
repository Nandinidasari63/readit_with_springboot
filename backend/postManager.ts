import { ObjectId } from "mongodb";
import { postsCollection, usersCollection } from "./db/client.ts";
import { type Post } from "../frontend/src/reducer.tsx";

export class PostManager {
  async getPosts(userId: string | undefined) {
    if (!userId) return null;

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return {
        _id: "",
        name: "",
        subscriptions: [],
        posts: [],
      };
    }

    const posts = await postsCollection.find({
      userId: user._id.toString(),
    }).toArray();

    return {
      _id: user._id.toString(),
      name: user.name,
      subscriptions: [],
      posts: posts.map((p) => ({
        ...p,
        _id: p._id.toString(),
        likes: [],
      })),
    };
  }

  async getUsers() {
    return (await postsCollection.find({})
      .toArray());
  }

  async addPost(data: Post, userId: string | undefined) {
    if (!userId) return;

    const result = await postsCollection.insertOne({
      ...data,
      userId,
    });
    return result.insertedId;
  }

  async addUser({ name, password }: { name: string; password: string }) {
    const user = await usersCollection.findOne({ name, password });

    if (user) {
      return { user, isNew: false };
    }

    const res = await usersCollection.insertOne({
      name,
      password,
    });

    return {
      user: {
        _id: res.insertedId,
        name,
        password,
      },
      isNew: true,
    };
  }

  async removePost(id: number, userId: string) {
    await postsCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { posts: { id: id } } },
    );
  }

  async subscribe(userId: string, targetUserId: string) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { subscriptions: targetUserId } }, //if we push duplicates will there but addtoset solves that
    );
  }

  async unsubscribe(userId: string, targetUserId: string) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { subscriptions: targetUserId } },
    );
  }

  async likePost(userId: string, postOwnerId: string, postId: number) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(postOwnerId), "posts.id": postId },
      { $addToSet: { "posts.$.likes": userId } },
    );
  }

  async unlikePost(userId: string, postOwnerId: string, postId: number) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(postOwnerId), "posts.id": postId },
      { $pull: { "posts.$.likes": userId } },
    );
  }
}
