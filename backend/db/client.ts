import { MongoClient, ObjectId, OptionalId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("readit");

export type User = {
  _id: ObjectId;
  name: string;
  githubId: number;
};

export const usersCollection = db.collection<OptionalId<User>>("users");

export type Post = {
  _id: ObjectId;
  title: string | null;
  body: string | null;
  time: string;
  userId: string;
  name: string;
};
export const postsCollection = db.collection<OptionalId<Post>>("posts");

export type Subscription = {
  _id: ObjectId;
  userId: string; // follower
  targetUserId: string; // following
};

export const subscriptionsCollection = db.collection<OptionalId<Subscription>>(
  "subscriptions",
);

export type Like = {
  _id: ObjectId;
  userId: string;
  postId: string; // postid in string
};

// usersCollection.insertMany([
//   { name: "alice", githubId: 111 },
//   { name: "bob", githubId: 222 },
//   { name: "charlie", githubId: 333 },
// ]);

export const likesCollection = db.collection<OptionalId<Like>>("likes");
