import { Input } from "postcss";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ referenceId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.threads.findUnique({
      where: {
        id: input.referenceId
      },
      include: {
        chat: true
      }
    })
  }),
  createThread: publicProcedure.input(z.object({ referenceId: z.string(), friendId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(async ({ ctx, input }) => {
    const existingThread = await ctx.prisma.threads.findUnique({
      where: {
        id: input.referenceId
      }
    })
    // reference id to get the user whos thread its supposed to be .. current user controlling things. And then get the specific thread by getting the friend id and display that chat message and also reference that friend id when adding chats to the current thread.
    if (existingThread?.id.includes(input.referenceId)) {
      return existingThread
    } else {
      const threadDoesntExist = await ctx.prisma.threads.create({
        data: {
          threadId: input.referenceId,
          friendId: input.friendId,
          messenger: input.userToSendMessage
        }
      })

      return threadDoesntExist
    }
  }),
  postMessage: publicProcedure
    .input(z.object({ referenceId: z.string(), chat: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newMessagePost = await ctx.prisma.threads.update({
        where: {
          id: input.referenceId
        },
        include: {
          chat: true
        },
        data: {
          chat: {
            create: {
              message: input.chat,
              user: input.userSendingMessage,
            }
          }
        }
      })
      return newMessagePost
    })
});