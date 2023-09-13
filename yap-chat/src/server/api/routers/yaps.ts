import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const yapRouter = createTRPCRouter({
  getAllYaps: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.yap.findMany({
      include: {
        likes: true
      }
    })
  }),
  findSpecificYap: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.yap.findMany({
        include: {
          likes: true
        },
        where: {
          likes: {
            some: {
              user: input.text
            }
          }
        },
      })
    })
});