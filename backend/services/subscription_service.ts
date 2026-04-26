import { subscriptionsCollection } from "../db/client.ts";

export class SubscriptionService {
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

  async getSubscriptions(userId: string) {
    const subs = await subscriptionsCollection
      .find({ userId })
      .toArray();

    return subs.map((s) => s.targetUserId);
  }
}
