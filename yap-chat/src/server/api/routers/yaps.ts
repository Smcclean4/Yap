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
      take: 100,
      orderBy: {
        createdAt: "desc"
      }
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
    }),
  likeYap: publicProcedure
    .input(z.object({ user: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.findUnique({
        include: {
          likes: true
        },
        where: {
          // find id of the post that is going to get liked and update by adding user that liked
          id: input.id
        }
      })
    })
});