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
    .mutation(async ({ ctx, input }) => {

      const existingYap = await ctx.prisma.yap.findUnique({
        where: {
          id: input.id,
        },
        select: {
          message: true,
          options: true
        }
      })

      const result = await ctx.prisma.yap.upsert({
        include: {
          likes: true
        },
        where: {
          id: input.id,
        },
        update: {
          likes: {
            delete: {
              id: Number(input.id)
            },
          },
        },
        create: {
          message: existingYap?.message | undefined,
          options: existingYap?.options,
          likes: {
            create: {
              user: input.user,
            },
          },
        },
      })

      return result
    })
});