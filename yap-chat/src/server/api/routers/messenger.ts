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
      // looking into this
      const existingThread = await ctx.prisma.threads.findUnique({
        where: {
          messenger: input.userToSendMessage
        },
        select: {
          chat: true
        }
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
    .input(z.object({ chat: z.string(), userSendingMessageId: z.string().optional(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // look into this
      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          messenger: input.userSendingMessage
        },
        include: {
          chat: true,
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
    .input(z.object({ userSendingMessage: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.threads.delete({
        where: {
           messenger: input.userSendingMessage
          }
      })
    })
});