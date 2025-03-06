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
  createThread: publicProcedure.input(z.object({ referenceId: z.string(), threadId: z.string(), chatMessage: z.string(), userToSendMessage: z.string() })).mutation(async ({ ctx, input }) => {
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
    .input(z.object({ referenceId: z.string(), chat: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // maybe instead of update use create like "postYap" but try something else that will maybe work? maybe asyn is the issue? or maybe the input is wrong?
      const newMessagePost = await ctx.prisma.threads.update({
        include: {
          chat: true
        },
        where: {
          threadId: input.referenceId
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