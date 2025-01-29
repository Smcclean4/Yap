import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        messages: true
      },
      take: 50
    })
  }),
  postMessage: publicProcedure
    .input(z.object({ id: z.string(), messages: z.array(z.string()), user: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          messages: {
            create: {
              chat: input.messages,
              messenger: input.user
            }
          }
        }
      })
    })
});