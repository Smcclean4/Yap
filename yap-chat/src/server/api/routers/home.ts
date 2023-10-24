import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const homeUpdatesRouter = createTRPCRouter({
  getHomeUpdates: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.homeUpdates.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
  })
});