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
      },
      take: 100
    })
  }),
  findSpecificUserLikes: publicProcedure
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
    }),
  postYap: publicProcedure
    .input(z.object({ message: z.string(), user: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.create({
        include: {
          likes: true
        },
        data: {
          message: input.message,
          user: input.user,
          options: false
        }
      })
    })
});