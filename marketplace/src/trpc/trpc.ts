import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { PayloadRequest } from "payload/types";
import { User } from "./payloadTypes";

const t = initTRPC.context<ExpressContext>().create();
const middleware = t.middleware;
export const router = t.router;

const isAuth = middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest;
  const { user } = req as { user: User | null };
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user,
    },
  });
});

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
