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
        threadId: input.referenceId
      },
      include: {
        chat: true
      }
    })
  }),
  createThread: publicProcedure.input(z.object({ referenceId: z.string(), friendId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(async ({ ctx, input }) => {
    const existingThread = await ctx.prisma.threads.findUnique({
      where: {
        threadId: input.referenceId
      }
    })
    if (existingThread?.threadId === input.referenceId) {
      return existingThread
    } else {
      const threadDoesntExist = await ctx.prisma.user.update({
        where: {
          id: input.referenceId
        },
        include: {
          messages: true
        },
        data: {
          messages: {
            create: {
              friendId: input.friendId,
              messenger: input.userToSendMessage
            }
          }
        }
      })

      return threadDoesntExist
    }
  }),
  postMessage: publicProcedure
    .input(z.object({ referenceId: z.string(), chat: z.string(), userSendingMessage: z.string(), friendId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const oldMessagePost = await ctx.prisma.threads.findUnique({
        where: {
          threadId: input.referenceId
        },
        include: {
          chat: true
        }
      })
      // so threadId is the exact same as id from user.. it reference that so you can relate back to the main user. im assuming the trick is that you have to then find the "friend" based on other conditions within that specification.
      if (oldMessagePost?.friendId === input.friendId) {
        return oldMessagePost
      } else {
        const newMessagePost = await ctx.prisma.threads.update({
          where: {
            threadId: input.referenceId
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
        return newMessagePost
      }
    })
});