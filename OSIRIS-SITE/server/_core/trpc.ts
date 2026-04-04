import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export { TRPCError };

// Add logging middleware for debugging
const logMiddleware = t.middleware(async opts => {
  const { path, type, input, next } = opts;
  console.log(`[tRPC] ${type} ${path} - Input:`, JSON.stringify(input));
  try {
    const result = await next();
    console.log(`[tRPC] ${type} ${path} - Success`);
    return result;
  } catch (error) {
    console.error(`[tRPC] ${type} ${path} - Error:`, error);
    throw error;
  }
});

export const publicProcedure = t.procedure.use(logMiddleware);

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
