import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// Helper to compute a stable, symmetric thread key for a pair of users.
// We always use the "smaller" userId as threadId and the "larger" as messenger.
const getThreadKey = (userAId: string, userBId: string) => {
  const [threadOwnerId, otherId] =
    userAId < userBId ? [userAId, userBId] : [userBId, userAId];

  return {
    threadId: threadOwnerId,
    messenger: otherId,
  };
};

export const messengerRouter = createTRPCRouter({
  // Fetch all messages between the logged-in user and a friend.
  getChatMessages: protectedProcedure
    .input(z.object({ friendName: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      // Find the friend's user record by name
      const friendUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.friendName,
        },
        select: {
          id: true,
        },
      });

      if (!friendUser) {
        return null;
      }

      const { threadId, messenger } = getThreadKey(currentUserId, friendUser.id);

      return ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId,
            messenger,
          },
        },
        include: {
          chat: true,
        },
      });
    }),

  // Ensure a thread exists between the logged-in user and a friend.
  createThread: protectedProcedure
    .input(z.object({ friendName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      const friendUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.friendName,
        },
        select: {
          id: true,
        },
      });

      if (!friendUser) {
        throw new Error("Friend user not found");
      }

      const { threadId, messenger } = getThreadKey(currentUserId, friendUser.id);

      const existingThread = await ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId,
            messenger,
          },
        },
        include: {
          chat: true,
        },
      });

      if (existingThread) {
        return existingThread;
      }

      return ctx.prisma.threads.create({
        data: {
          threadId,
          messenger,
        },
        include: {
          chat: true,
        },
      });
    }),

  // Post a message between the logged-in user and a friend. If the thread doesn't exist yet, create it.
  postMessage: protectedProcedure
    .input(z.object({ chat: z.string(), friendName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      const friendUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.friendName,
        },
        select: {
          id: true,
        },
      });

      if (!friendUser) {
        throw new Error("Friend user not found");
      }

      const { threadId, messenger } = getThreadKey(currentUserId, friendUser.id);

      // Upsert the thread and append the message
      const updatedThread = await ctx.prisma.threads.upsert({
        where: {
          threadId_messenger: {
            threadId,
            messenger,
          },
        },
        update: {
          chat: {
            create: {
              message: input.chat,
              // Store the sender's user id so we can distinguish who sent what
              user: currentUserId,
            },
          },
        },
        create: {
          threadId,
          messenger,
          chat: {
            create: {
              message: input.chat,
              user: currentUserId,
            },
          },
        },
        include: {
          chat: true,
        },
      });

      return updatedThread;
    }),

  // Delete the thread between the logged-in user and a friend.
  deleteThread: protectedProcedure
    .input(z.object({ friendName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      const friendUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.friendName,
        },
        select: {
          id: true,
        },
      });

      if (!friendUser) {
        throw new Error("Friend user not found");
      }

      const { threadId, messenger } = getThreadKey(currentUserId, friendUser.id);

      return ctx.prisma.threads.delete({
        where: {
          threadId_messenger: {
            threadId,
            messenger,
          },
        },
      });
    }),
});