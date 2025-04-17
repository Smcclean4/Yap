import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure.input(z.object({ sender: z.string().optional() })).query(({ ctx, input }) => {
    return ctx.prisma.threads.findUnique({
      where: {
        messenger: input.sender
      },
      include: {
        chat: true
      }
    })
  }),
  createThread: publicProcedure
    .input(z.object({ referenceId: z.string(), userToSendMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingThread = await ctx.prisma.threads.findUnique({
        where: {
          messenger: input.userToSendMessage
        },
        include: {
          chat: true
        }
      })

      if (existingThread) {
        return existingThread;
      }

      const createThread = await ctx.prisma.user.update({
        include: {
          messages: true
        },
        where: {
          id: input.referenceId
        },
        data: {
          messages: {
            create: {
              messenger: input.userToSendMessage
            }
          }
        }
      })

      return createThread;
    }),
  postMessage: publicProcedure
    .input(z.object({ chat: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // could also be that database storage of friends needs to be set up in friends tab to consistently persist userinfo data.. 
      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          messenger: input.userSendingMessage
        },
        include: {
          chat: true
        }
      })

      if (!threadFound) {
        throw Error('Thread not found!')
      }

      const createChat = await ctx.prisma.threads.update({
        include: {
          chat: true
        },
        where: {
          messenger: input.userSendingMessage
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

      return createChat;
    }),
  deleteThread: publicProcedure
    .input(z.object({ threadId: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.threads.delete({
        where: {
           threadId: input.threadId 
          }
      })
    })
});