import { ObjectId } from "mongodb";
import { postsCollection } from "./db/client.ts";
import { type Post } from "../frontend/src/reducer.tsx";

export class PostManager {
  async getPosts(userId: string | undefined) {
    const user = await postsCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) return null;

    const subscribedUsers = await postsCollection.find({
      _id: { $in: user.subscriptions.map((id) => new ObjectId(id)) },
    }).toArray();

    return {
      _id: user._id.toString(),
      name: user.name,
      subscriptions: user.subscriptions,
      posts: [
        ...user.posts.map((p) => ({
          ...p,
        })),
        ...subscribedUsers.flatMap((u) =>
          u.posts.map((p) => ({
            ...p,
          }))
        ),
      ],
    };
  }

  async getUsers() {
    return (await postsCollection.find({})
      .toArray());
  }

  async addPost(data: Post, userId: string | undefined) {
    return await postsCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { posts: data } },
    );
  }

  async addUser({ name, password }: { name: string; password: string }) {
    const user = await postsCollection.findOne({ name, password });

    if (user) {
      return { user, isNew: false };
    }

    const res = await postsCollection.insertOne({
      name,
      password,
      posts: [],
      subscriptions: [],
    });

    return {
      user: {
        _id: res.insertedId,
        name,
        password,
        posts: [],
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
