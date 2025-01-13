import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.thread.findUnique({
      where: {
        id: input.id
      }
    })
  }),
  postMessage: publicProcedure
    .input(z.object({ id: z.string(), message: z.string(), user: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.thread.create({
        data: {
          chat: {

          }
        }
      })
    })
});