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
      const existingThread = await ctx.prisma.user.findUnique({
        where: {
<<<<<<< HEAD
          messenger: input.userToSendMessage
=======
          id: input.referenceId
>>>>>>> development
        },
        select: {
          messages: true
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
  
        return createThread;
      }
    }),
  postMessage: publicProcedure
    .input(z.object({ chat: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
<<<<<<< HEAD
      // could also be that database storage of friends needs to be set up in friends tab to consistently persist userinfo data.. 
=======
      // look into this
>>>>>>> development
      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          messenger: input.userSendingMessage
        },
        include: {
<<<<<<< HEAD
          chat: true
=======
          chat: true,
>>>>>>> development
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