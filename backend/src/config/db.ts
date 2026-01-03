import mongoose from "mongoose";
import { env } from "./env";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & { __mongoose?: MongooseCache };

const cached = globalForMongoose.__mongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose.__mongoose = cached;

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(env.MONGODB_URI, { autoIndex: env.NODE_ENV !== "production" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
