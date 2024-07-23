import express from "express";
import { getPayloadClient } from "./getPayload";
import { nextApp, nextHandler } from "./nextUtils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./Webhooks";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };
const start = async () => {
  const webHookMiddleWare = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhook/stripe", webHookMiddleWare, stripeWebhookHandler);
  const payload = await getPayloadClient({
    initOption: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  app.use((req, res) => {
    nextHandler(req, res);
  });
  nextApp.prepare().then(() => {
    payload.logger.info("Next js is start");
    app.listen(PORT, () => {
      payload.logger.info(
        `Next js app url ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};
start();
