import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
let cached = (global as any).payload;
if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}
interface Args {
  initOption?: Partial<InitOptions>;
}
export const getPayloadClient = async ({
  initOption,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("Payload Secret not found");
  }
  if (cached.client) {
    return cached.client;
  }
  if (!cached.client) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOption?.express ? false : true,
      ...(initOption || {}),
    });
  }
  try {
    cached.client = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }
  return cached.client;
};
