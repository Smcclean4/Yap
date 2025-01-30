import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      select: {
        messages: true
      },
      where: {
        id: input.id
      }
    })
  }),
  postMessage: publicProcedure
    .input(z.object({ referenceId: z.string(), chat: z.array(z.string()), user: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.threads.create({
        data: {
          threadId: input.referenceId,
          chat: input.chat,
          messenger: input.user
        }
      })
    })
});