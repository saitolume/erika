export type User = {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string;
  entities: {
    url: {
      urls: Array<{
        url: string;
        expanded_url: string;
        display_url: string;
        indices: [number, number];
      }>;
    };
    description: {
      urls: unknown[];
    };
  };
  following: boolean;
};

export type Tweet = {
  id: number;
  id_str: string;
  text: string;
  user: User;
  created_at: string;
};

export type Keys = {
  consumerApiKey: string;
  consumerApiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
};
