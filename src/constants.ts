import { Keys } from "./types.ts";

export const keys: Keys = {
  consumerApiKey: Deno.env.get("TWITTER_API_KEY") || "",
  consumerApiSecret: Deno.env.get("TWITTER_SECRET_KEY") || "",
  accessToken: Deno.env.get("TWITTER_ACCESS_TOKEN") || "",
  accessTokenSecret: Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET") || "",
};

export const imageUrls = ["https://gyazo.com/e52df993be257723f33ee138fd196fce"];

export const messages = ["これ食べな"];

export const triggers = [
  "はらへり",
  "腹へり",
  "腹減り",
  "はらへった",
  "腹へった",
  "腹減った",
  "おなかすいた",
  "お腹すいた",
  "くうふく",
  "空腹",
];
