import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  getAllFriends: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.friendships.findMany({
      take: 50
    })
  }),
  getAllRequests: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.request.findMany({
      take: 50
    })
  }),
  findSpecificFriend: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.findMany({
        where: {
          name: input.name
        }
      })
    }),
  deleteFriend: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.delete({
        where: {
          id: input.id
        }
      })
    }),
  approveRequest: publicProcedure
    .input(z.object({ name: z.string(), image: z.string(), online: z.boolean(), heading: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      // Create a friend record that references the current user (the one approving the request)
      return ctx.prisma.friendships.create({
        data: {
          friendId: input.id, // This should be the current user's ID
          name: input.name,
          image: input.image,
          online: input.online,
          heading: input.heading,
        }
      })
    }),
  deleteRequest: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.request.delete({
        where: {
          id: input.id
        }
      })
    })
});