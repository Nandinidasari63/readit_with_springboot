import { MongoClient } from "mongodb";
import { Post } from "../../frontend/src/reducer.tsx";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("redit");
type UserPosts = {
  name: string;
  password: string;
  posts: Post[];
};
export const postsCollection = db.collection<UserPosts>("users");
