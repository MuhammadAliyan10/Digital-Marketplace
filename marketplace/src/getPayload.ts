import dotenv from "dotenv";
import path from "path";
import type { InitOptions } from "payload/config";
import payload, { Payload } from "payload";
import nodemailer from "nodemailer";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
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
      email: {
        transport: transporter,
        fromAddress: "onboarding@resend.com",
        fromName: "MarketPlace",
      },
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
