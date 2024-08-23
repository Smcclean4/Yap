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
      return ctx.prisma.request.delete({
        where: {
          id: input.id
        }
      })
    })
});