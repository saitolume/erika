import { imageUrls, messages, triggers } from "./constants.ts";
import { db } from "./mongo.ts";
import { Tweet, User } from "./types.ts";
import { Twitter } from "../deps.ts";

const historiesRef = db.collection("histories");

export class Erika {
  #twitter: Twitter;

  constructor(twitter: Twitter) {
    this.#twitter = twitter;
  }

  public async readTimeline(): Promise<Tweet[]> {
    const [{ sinceId }] = await historiesRef.find(undefined, { limit: 1 });

    const tweets: Tweet[] = await this.#twitter
      .get(
        "statuses/home_timeline.json",
        sinceId ? { count: "100", since_id: sinceId } : { count: "100" },
      )
      .then((res) => res.json());

    const lastIdTweet = tweets[tweets.length - 1]?.id_str;

    if (lastIdTweet) {
      await historiesRef.insertOne({ sinceId: lastIdTweet });
    }

    return tweets;
  }

  public async readFollowers(): Promise<User[]> {
    const { users } = await this.#twitter
      .get("followers/list.json", { count: "100" })
      .then((res) => res.json());
    return users;
  }

  public async reply(tweets: Tweet[]): Promise<void> {
    await Promise.all(
      tweets.map(async (tweet) => {
        const includesTriger = this.checkIncludesTrigger(tweet);
        if (!includesTriger) return;

        return this.#twitter.post("statuses/update.json", {
          in_reply_to_status_id: tweet.id_str,
          status: `@${tweet.user.screen_name} ${messages} ${imageUrls[0]}`,
        });
      }),
    );
  }

  public async followBack(followers: User[]): Promise<void> {
    const notFollowingUsers = followers.filter(this.checkNotFollowing);
    await Promise.all(
      notFollowingUsers.map(async (user) => {
        this.#twitter.post("friendships/create.json", {
          user_id: user.id_str,
          follow: "true",
        });
      }),
    );
  }

  private checkIncludesTrigger(tweet: Tweet) {
    return triggers.some((word) => tweet.text.includes(word));
  }

  private checkNotFollowing(user: User) {
    return !user.following;
  }
}
