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
  createThread: publicProcedure.input(z.object({ referenceId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(async ({ ctx, input }) => {
    const existingThread = await ctx.prisma.threads.findUnique({
      where: {
        threadId: input.referenceId
      }
    })

    if (String(existingThread?.threadId) === input.referenceId) {
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
    .input(z.object({ referenceId: z.string(), friend: z.string(), chat: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // thread id seems to be differenct from regular id... maybe reference the current thread id somehow to find the thread.
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
              message: input.chat
            }
          }
        }
      })
      return newMessagePost
    })
});