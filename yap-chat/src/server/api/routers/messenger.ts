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
  // apply logic from here to "triggerMessage" so that thread gets created and can be updated. 
  createThread: publicProcedure.input(z.object({ threadId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.threads.create({
      data: {
        threadId: input.threadId,
        chat: input.chatMessage,
        messenger: input.userToSendMessage
      }
    })
  }),
  postMessage: publicProcedure
    .input(z.object({ referenceId: z.string(), chat: z.array(z.string()) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.threads.update({
        where: {
          id: input.referenceId
        },
        data: {
          chat: {
            push: input.chat
          }
        }
      })
    })
});