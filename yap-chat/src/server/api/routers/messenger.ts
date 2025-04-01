import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ friendId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.threads.findUnique({
      where: {
        friendId: input.friendId
      },
      include: {
        chat: true
      }
    })
  }),
  createThread: publicProcedure
    .input(z.object({ referenceId: z.string(), friendId: z.string(), userToSendMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingThread = await ctx.prisma.threads.findUnique({
        where: {
          friendId: input.friendId
        },
        include: {
          chat: true
        }
      })

      if (existingThread) {
        return existingThread;
      }

      const createThread = await ctx.prisma.threads.create({
        include: {
          chat: true
        },
        data: {
          threadId: input.referenceId,
          friendId: input.friendId,
          messenger: input.userToSendMessage,
          chat: {
            create: {
              message: `Started a conversation with ${input.userToSendMessage}`,
              user: input.userToSendMessage
            }
          }
        }
      })

      return createThread;
    }),
  postMessage: publicProcedure
    .input(z.object({ referenceId: z.string(), chat: z.string(),friendId: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          friendId: input.friendId
        },
        include: {
          chat: true
        }
      })

      if (!threadFound) {
        throw new Error("Thread not found")
      }

      const updatedThread = await ctx.prisma.threads.update({
        where: {
          friendId: input.friendId
        },
        include: {
          chat: true
        },
        data: {
          chat: {
            create: {
              message: input.chat,
              user: input.userSendingMessage
            }
          }
        }
      })

      return updatedThread
    }),
  deleteThread: publicProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.threads.delete({
        where: {
           friendId: input.friendId 
          }
      })
    })
});