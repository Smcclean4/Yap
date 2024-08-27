import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  getAllFriends: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.friend.findMany({
      take: 50
    })
  }),
  getAllRequests: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.request.findMany({
      take: 50
    })
  }),
  deleteFriend: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friend.delete({
        where: {
          id: input.id
        }
      })
    }),
  approveRequest: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.create({
        include: {
          friends: true
        },
        data: {
          requests: {
            create: {
              name: input.name
            }
          }
        }
      })
    })
});