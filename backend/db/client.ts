import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("readit");

export type User = {
  _id: ObjectId;
  name: string;
  password: string;
};

export const usersCollection = db.collection<User>("users");

export type Post = {
  _id: ObjectId;
  title: string | null;
  body: string | null;
  time: string;
  userId: string;
  name: string;
};

export const postsCollection = db.collection<Post>("posts");

export type Subscription = {
  _id: ObjectId;
  userId: string; // follower
  targetUserId: string; // following
};

export const subscriptionsCollection = db.collection<Subscription>(
  "subscriptions",
);

export type Like = {
  _id: ObjectId;
  userId: string;
  postId: string; // postid in string
};

export const likesCollection = db.collection<Like>("likes");
