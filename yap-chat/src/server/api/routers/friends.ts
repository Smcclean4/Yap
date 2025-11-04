import { FriendStatus } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  getAllFriends: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.friendships.findMany({
      where: {
        status: "ACCEPTED"
      }
    })
  }),
  getAllRequests: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.friendships.findMany({
      where: {
        status: "PENDING"
      }
    })
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
  approveRequest: publicProcedure
    .input(z.object({ name: z.string(), image: z.string(), online: z.boolean(), heading: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      // Create a friend record that references the current user (the one approving the request)
      return ctx.prisma.friendships.update({
        where: {
          id: input.id
        },
        select: {
          pendingFriendId: true
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
    })
});