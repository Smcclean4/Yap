import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ referenceId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.threads.findUnique({
      where: {
        threadId: input.referenceId
      },
      include: {
        chat: true
      }
    })
  }),
  createThread: publicProcedure.input(z.object({ referenceId: z.string(), threadId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(async ({ ctx, input }) => {
    const existingThread = await ctx.prisma.threads.findUnique({
      where: {
        threadId: input.referenceId
      }
    })

    if (String(existingThread?.threadId) == input.referenceId) {
      return existingThread
    } else {
      const threadDoesntExist = await ctx.prisma.threads.create({
        data: {
          threadId: input.referenceId,
          messenger: input.userToSendMessage
        }
      })

      return threadDoesntExist
    }
  }),
  postMessage: publicProcedure
    .input(z.object({ referenceId: z.string(), chat: z.string(), userSendingMessage: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.chat.create({
        data: {
          message: input.chat,
          senderId: input.userSendingMessage
        }
      })
    })
})