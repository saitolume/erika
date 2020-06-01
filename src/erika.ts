import { imageUrls, messages, triggers } from "./constants.ts";
import { Tweet, User } from "./types.ts";
import { Twitter } from "../deps.ts";

export class Erika {
  #twitter: Twitter;

  constructor(twitter: Twitter) {
    this.#twitter = twitter;
  }

  public async readTimeline(): Promise<Tweet[]> {
    const tweets: Tweet[] = await this.#twitter
      .get("statuses/home_timeline.json", { count: "200" })
      .then((res) => res.json());

    return tweets.filter((tweet) => {
      const includesTriger = this.checkIncludesTrigger(tweet);
      const isRt = this.checkRt(tweet);
      const isFavorite = this.checkIsFavorite(tweet);
      return !isFavorite && !isRt && includesTriger;
    });
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
        await this.favarite(tweet);
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

  private async favarite(tweet: Tweet): Promise<void> {
    if (this.checkIsFavorite(tweet)) return;
    await this.#twitter.post("favorites/create.json", { id: tweet.id_str });
  }

  private checkIncludesTrigger(tweet: Tweet) {
    return triggers.some((word) => tweet.text.includes(word));
  }

  private checkNotFollowing(user: User) {
    return !user.following;
  }

  private checkIsFavorite(tweet: Tweet) {
    return tweet.favorited;
  }

  private checkRt(tweet: Tweet) {
    return tweet.text.includes("RT");
  }
}
