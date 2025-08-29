import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const messengerRouter = createTRPCRouter({
  getChatMessages: publicProcedure
    .input(z.object({ threadId: z.string().optional(), sender: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.threadId || !input.sender) {
        return null;
      }
      
      // Find the friend's user record to get their ID
      const friendUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.sender
        },
        select: {
          id: true
        }
      })
      
      if (!friendUser) {
        return null;
      }
      
      return ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId: friendUser.id, // Use friend's ID as thread ID
            messenger: input.sender, // Friend's name as messenger
          },
        },
        include: {
          chat: true,
        },
      });
    }),
  createThread: publicProcedure
    .input(z.object({ userToSendMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the friend/user you're messaging by their name
        const friendUser = await ctx.prisma.user.findUnique({
          where: {
            name: input.userToSendMessage
          },
          select: {
            id: true,
            name: true
          }
        })

        if (!friendUser) {
          throw new Error('Friend user not found')
        }

        // Check if thread already exists using the friend's ID as threadId
        const existingThread = await ctx.prisma.threads.findUnique({
          where: {
            threadId_messenger: {
              threadId: friendUser.id, // Use friend's ID as thread ID
              messenger: input.userToSendMessage, // Friend's name as messenger
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
          console.log('Thread already exists, returning existing thread')
          return existingThread;
        }

        // Create thread using friend's ID as threadId
        const createThread = await ctx.prisma.user.update({
          where: {
            id: friendUser.id // Update the friend's user record
          },
          data: {
            messages: {
              create: {
                messenger: input.userToSendMessage // Friend's name
              }
            }
          }
        })

        return createThread
      } catch (error) {
        console.error('Error in createThread:', error)
        // If it's a unique constraint error, try to find and return the existing thread
        if (error instanceof Error && error.message.includes('Unique constraint failed')) {
          const friendUser = await ctx.prisma.user.findUnique({
            where: {
              name: input.userToSendMessage
            }
          })
          
          if (friendUser) {
            const existingThread = await ctx.prisma.threads.findUnique({
              where: {
                threadId_messenger: {
                  threadId: friendUser.id,
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
              return existingThread
            }
          }
        }
        throw error
      }
    }),
  postMessage: publicProcedure
    .input(z.object({ chat: z.string(), userSendingMessageId: z.string(), userSendingMessage: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Find the friend's user record to get their ID
      const friendUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.userSendingMessage
        },
        select: {
          id: true
        }
      })
      
      if (!friendUser) {
        throw Error('Friend user not found!')
      }
      
      const threadFound = await ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId: friendUser.id, // Use friend's ID as thread ID
            messenger: input.userSendingMessage, // Friend's name as messenger
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
            threadId: friendUser.id, // Use friend's ID as thread ID
            messenger: input.userSendingMessage, // Friend's name as messenger
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