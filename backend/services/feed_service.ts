import { UserService } from "./user_service.ts";
import { PostService } from "./post_service.ts";
import { LikeService } from "./like_service.ts";
import { SubscriptionService } from "./subscription_service.ts";

export class FeedService {
  constructor(
    private userService = new UserService(),
    private postService = new PostService(),
    private likeService = new LikeService(),
    private subscriptionService = new SubscriptionService(),
  ) {}

  async getFeed(userId: string | undefined) {
    if (!userId) return null;

    const user = await this.userService.getUser(userId);
    if (!user) return null;

    const subscriptions = await this.subscriptionService.getSubscriptions(
      userId,
    );

    const authorIds = [userId, ...subscriptions];

    const posts = await this.postService.getPostsByUsers(authorIds);

    const postsWithLikes = await this.likeService.attachLikes(posts);

    const uniqueAuthorIds = [...new Set(posts.map((p) => p.userId))];
    const authors = await this.userService.getUsersByIds(uniqueAuthorIds);
    const avatarMap = new Map(
      authors.map((a) => [a._id.toString(), a.avatarUrl]),
    );

    const postsWithAvatars = postsWithLikes.map((p) => ({
      ...p,
      avatarUrl: avatarMap.get(p.userId),
    }));

    return {
      _id: userId,
      name: user.name,
      avatarUrl: user.avatarUrl,
      subscriptions,
      posts: postsWithAvatars,
    };
  }
}
