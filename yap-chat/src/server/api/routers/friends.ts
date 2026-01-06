import { FriendStatus } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  getAllFriends: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    
    const friendships = await ctx.prisma.friendships.findMany({
      where: {
        status: "ACCEPTED",
        OR: [
          { pendingFriendId: currentUserId },
          { mutualFriendId: currentUserId }
        ]
      },
      include: {
        pendingFriend: {
          select: {
            id: true,
            name: true,
            image: true,
            heading: true,
            online: true
          }
        },
        mutualFriend: {
          select: {
            id: true,
            name: true,
            image: true,
            heading: true,
            online: true
          }
        }
      }
    });

    // Transform to return the other user (not the current user)
    return friendships.map(friendship => {
      const otherUser = friendship.pendingFriendId === currentUserId 
        ? friendship.mutualFriend 
        : friendship.pendingFriend;
      
      return {
        id: friendship.id,
        name: otherUser?.name ?? null,
        image: otherUser?.image ?? null,
        heading: otherUser?.heading ?? null,
        online: otherUser?.online === "ONLINE",
        friendId: otherUser?.id ?? null
      };
    });
  }),
  getAllRequests: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    
    const friendships = await ctx.prisma.friendships.findMany({
      where: {
        status: "PENDING",
        mutualFriendId: currentUserId // Only show requests where current user is the recipient
      },
      include: {
        pendingFriend: {
          select: {
            id: true,
            name: true,
            image: true,
            heading: true,
            online: true
          }
        },
        mutualFriend: {
          select: {
            id: true,
            name: true,
            image: true,
            heading: true,
            online: true
          }
        }
      }
    });

    // Return the user who sent the request
    return friendships.map(friendship => ({
      id: friendship.id,
      name: friendship.pendingFriend?.name ?? null,
      image: friendship.pendingFriend?.image ?? null,
      heading: friendship.pendingFriend?.heading ?? null,
      online: friendship.pendingFriend?.online === "ONLINE",
      friendId: friendship.pendingFriend?.id ?? null
    }));
  }),
  findSpecificFriend: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.findMany({
        where: {
          mutualFriend: {
            name: input.name
          }
        }
      })
    }),
  deleteFriend: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.delete({
        where: {
          id: input.id
        },
        select: {
          mutualFriendId: true,
        }
      })
    }),
  approveRequest: protectedProcedure
    .input(z.object({ name: z.string(), image: z.string(), online: z.boolean(), heading: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      
      // Verify that the current user is the recipient of this request (mutualFriend)
      const friendship = await ctx.prisma.friendships.findUnique({
        where: {
          id: input.id
        }
      });

      if (!friendship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Friendship request not found"
        });
      }

      if (friendship.mutualFriendId !== currentUserId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only approve friend requests sent to you"
        });
      }

      // Update the friendship status to ACCEPTED
      return ctx.prisma.friendships.update({
        where: {
          id: input.id
        },
        data: {
          status: "ACCEPTED"
        }
      })
    }),
  deleteRequest: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.delete({
        where: {
          id: input.id
        },
        select: {
          pendingFriendId: true
        },
      })
    }),
  createFriendRequest: protectedProcedure
    .input(z.object({ targetUserName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the current user's ID from the session
      const currentUserId = ctx.session.user.id;

      // Find the target user by name
      const targetUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.targetUserName
        },
        select: {
          id: true,
          name: true
        }
      });

      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found"
        });
      }

      // Prevent users from sending friend requests to themselves
      if (currentUserId === targetUser.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot send friend request to yourself"
        });
      }

      // Check if a friendship already exists (in either direction)
      const existingFriendship = await ctx.prisma.friendships.findFirst({
        where: {
          OR: [
            {
              pendingFriendId: currentUserId,
              mutualFriendId: targetUser.id
            },
            {
              pendingFriendId: targetUser.id,
              mutualFriendId: currentUserId
            }
          ]
        }
      });

      if (existingFriendship) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Friendship request already exists"
        });
      }

      // Create the friend request
      return ctx.prisma.friendships.create({
        data: {
          pendingFriendId: currentUserId,
          mutualFriendId: targetUser.id,
          status: "PENDING"
        },
        include: {
          pendingFriend: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          mutualFriend: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      });
    })
});