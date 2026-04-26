import { ObjectId } from "mongodb";
import {
  likesCollection,
  postsCollection,
  subscriptionsCollection,
  usersCollection,
} from "./db/client.ts";

type Post = {
  _id: ObjectId;
  title: string | null;
  body: string | null;
  time: string;
  userId: string;
  name: string;
};

export class PostManager {
  async getPosts(userId: string | undefined) {
    if (!userId) return null;

    // 1. current user
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) return null;

    // 2. subscriptions
    const subs = await subscriptionsCollection
      .find({ userId })
      .toArray();

    const authorIds = [
      userId,
      ...subs.map((s) => s.targetUserId),
    ];

    // 3. posts
    const posts = await postsCollection
      .find({ userId: { $in: authorIds } })
      .toArray();

    // 4. likes
    const postIds = posts.map((p) => p._id.toString());

    const likes = await likesCollection
      .find({ postId: { $in: postIds } })
      .toArray();

    // 5. map likes → posts
    const postsWithLikes = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      likes: likes
        .filter((l) => l.postId === post._id.toString())
        .map((l) => l.userId),
    }));

    return {
      _id: user._id.toString(),
      name: user.name,
      subscriptions: subs.map((s) => s.targetUserId),
      posts: postsWithLikes,
    };
  }
  async getUsers() {
    const users = await usersCollection.find({}).toArray();

    return users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));
  }

  async addPost(data: Post, userId: string | undefined) {
    if (!userId) return;

    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) return;

    const result = await postsCollection.insertOne({
      ...data,
      userId,
      name: user.name,
    });

    return result.insertedId.toString();
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
        _id: res.insertedId.toString(),
        name,
        password,
      },
      isNew: true,
    };
  }

  async removePost(id: string, userId: string) {
    await postsCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });
  }

  async subscribe(userId: string, targetUserId: string) {
    await subscriptionsCollection.updateOne(
      { userId, targetUserId },
      { $set: { userId, targetUserId } },
      { upsert: true },
    );
  }
  async unsubscribe(userId: string, targetUserId: string) {
    await subscriptionsCollection.deleteOne({
      userId,
      targetUserId,
    });
  }
  async likePost(userId: string, postId: string) {
    await likesCollection.updateOne(
      { userId, postId },
      { $set: { userId, postId } },
      { upsert: true },
    );
  }

  async unlikePost(userId: string, postId: string) {
    await likesCollection.deleteOne({
      userId,
      postId,
    });
  }
}
