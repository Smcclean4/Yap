import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
          // look into the below reference .. 
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
    .input(z.object({ chat: z.string(), userSendingMessage: z.string(), friendId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          friendId: input.friendId
        },
        select: {
          messenger: true,
          chat: {
            select: {
              user: true
            }
          }
        }
      })

      // look at yap front end and make sure that the referenced id to create like is similar to this
      if (threadFound?.chat.map((val: { user: string | null}) => val.user).includes(input.userSendingMessage)) {
        const createChat = await ctx.prisma.threads.update({
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
        
        return createChat
      } else {
        throw new Error("Thread not found")
      }
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