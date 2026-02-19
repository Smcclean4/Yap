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

      const thread = await ctx.prisma.threads.findUnique({
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

      if (!thread) {
        return null;
      }

      // Filter messages based on when the user cleared their chat
      // If the user has cleared, only show messages created after the cleared timestamp
      const clearedAt = thread.clearedAt as Record<string, string> | null;
      const userClearedTimestamp = clearedAt?.[currentUserId];
      
      let filteredChat = thread.chat;
      if (userClearedTimestamp) {
        const clearedDate = new Date(userClearedTimestamp);
        filteredChat = thread.chat.filter(
          (message) => message.createdAt > clearedDate
        );
      }

      return {
        ...thread,
        chat: filteredChat,
      };
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

  // Clear the chat for the current user only (doesn't delete the thread or affect the other user)
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

      // Get the current thread to preserve existing clearedAt data
      const thread = await ctx.prisma.threads.findUnique({
        where: {
          threadId_messenger: {
            threadId,
            messenger,
          },
        },
      });

      if (!thread) {
        throw new Error("Thread not found");
      }

      // Update clearedAt to mark this chat as cleared for the current user
      const clearedAt = (thread.clearedAt as Record<string, string> | null) || {};
      clearedAt[currentUserId] = new Date().toISOString();

      return ctx.prisma.threads.update({
        where: {
          threadId_messenger: {
            threadId,
            messenger,
          },
        },
        data: {
          clearedAt: clearedAt,
        },
      });
    }),
});