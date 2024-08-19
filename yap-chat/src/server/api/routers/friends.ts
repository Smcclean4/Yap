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
  })
});