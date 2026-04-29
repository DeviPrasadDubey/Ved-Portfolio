import mongoose from "mongoose";

declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

global._mongoose = global._mongoose ?? { conn: null, promise: null };

export async function connectDB() {
  if (global._mongoose.conn) return global._mongoose.conn;

  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((m) => m);
  }

  global._mongoose.conn = await global._mongoose.promise;
  return global._mongoose.conn;
}
