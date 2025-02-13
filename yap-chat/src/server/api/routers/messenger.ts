import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.threads.findUnique({
      where: {
        id: input.id
      }
    })
  }),
  createThread: publicProcedure.input(z.object({ threadId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(async ({ ctx, input }) => {
    const existingThread = await ctx.prisma.threads.findUnique({
      where: {
        id: input.threadId
      },
      select: {
        user: true
      }
    })

    if (String(existingThread?.user) == input.userToSendMessage) {
      return existingThread
    } else {
      const threadDoesntExist = await ctx.prisma.threads.create({
        data: {
          threadId: input.threadId,
          chat: input.chatMessage,
          messenger: input.userToSendMessage
        }
      })

      return threadDoesntExist
    }
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