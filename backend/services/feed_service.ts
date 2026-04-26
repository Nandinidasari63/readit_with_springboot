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

    return {
      _id: userId,
      name: user.name,
      subscriptions,
      posts: postsWithLikes,
    };
  }
}
