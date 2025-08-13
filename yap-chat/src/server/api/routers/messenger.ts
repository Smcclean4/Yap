import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure
    .input(z.object({ threadId: z.string().optional(), sender: z.string().optional() }))
    .query(({ ctx, input }) => {
      if (!input.threadId || !input.sender) {
        return null;
      }
      return ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId: input.threadId,
            messenger: input.sender,
          },
        },
        include: {
          chat: true,
        },
      });
    }),
  createThread: publicProcedure
    .input(z.object({ referenceId: z.string(), userToSendMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // looking into this
      const existingThread = await ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId: input.referenceId,
            messenger: input.userToSendMessage,
          },
        },
        select: {
          id: true,
          threadId: true,
          messenger: true,
          chat: true,
        },
      })

      if (existingThread) {
        return existingThread;
      } else {
        const createThread = await ctx.prisma.user.update({
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

        return createThread
      }
    }),
  postMessage: publicProcedure
    .input(z.object({ chat: z.string(), userSendingMessageId: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {

      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId: input.userSendingMessageId,
            messenger: input.userSendingMessage,
          },
        },
        include: {
          chat: true,
        },
      })

      if (!threadFound) {
        throw Error('Thread not found!')
      }

      const createChat = await ctx.prisma.threads.update({
        include: {
          chat: true
        },
        where: {
          threadId_messenger: {
            threadId: input.userSendingMessageId,
            messenger: input.userSendingMessage,
          },
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
    .input(z.object({ userId: z.string(), userSendingMessage: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.threads.delete({
        where: {
           threadId_messenger: {
             threadId: input.userId,
             messenger: input.userSendingMessage,
           },
          }
      })
    })
});