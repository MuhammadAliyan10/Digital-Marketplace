import express from "express";
import { getPayload } from "./getPayload";
import { nextApp, nextHandler } from "./nextUtils";

// Middleware for handling request body
const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await getPayload({
    initOption: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });
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
