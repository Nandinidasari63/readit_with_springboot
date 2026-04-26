// services/LikeService.ts
import { likesCollection } from "../db/client.ts";

export class LikeService {
  async like(userId: string, postId: string) {
    await likesCollection.updateOne(
      { userId, postId },
      { $set: { userId, postId } },
      { upsert: true },
    );
  }

  async unlike(userId: string, postId: string) {
    await likesCollection.deleteOne({ userId, postId });
  }

  async attachLikes(posts: any[]) {
    const postIds = posts.map((p) => p._id);

    const likes = await likesCollection
      .find({ postId: { $in: postIds } })
      .toArray();

    return posts.map((post) => ({
      ...post,
      likes: likes
        .filter((l) => l.postId === post._id)
        .map((l) => l.userId),
    }));
  }
}
