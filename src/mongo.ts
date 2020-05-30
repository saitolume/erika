import { MongoClient } from "../deps.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

export const db = client.database("erika");
