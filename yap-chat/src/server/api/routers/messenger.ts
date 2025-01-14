import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ user: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.thread.findMany({
      where: {
        user: input.user
      }
    })
  }),
  postMessage: publicProcedure
    .input(z.object({ id: z.string(), messages: z.array(z.string()), user: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.thread.create({
        data: {
          threadId: input.id,
          chat: input.messages,
          user: input.user
        }
      })
    })
});