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
        }
      })
    }),
  likeYap: publicProcedure
    .input(z.object({ user: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingYap = await ctx.prisma.yap.findUnique({
        where: {
          id: input.id
        },
        select: {
          message: true,
          likes: {
            select: {
              user: true
            }
          }
        }
      })

      if (existingYap?.likes.map((val: { user: any; }) => val.user).includes(input.user)) {
        const alreadyExists = await ctx.prisma.yap.update({
          include: {
            likes: true
          },
          where: {
            id: input.id
          },
          data: {
            likes: {
              delete: {
                yapId: input.id
              }
            }
          }
        })

        return alreadyExists

      } else {
        const doesntExist = await ctx.prisma.yap.update({
          include: {
            likes: true
          },
          where: {
            id: input.id
          },
          data: {
            likes: {
              create: {
                user: input.user
              }
            }
          }
        })

        return doesntExist
      }
    }),
  editYap: publicProcedure
    .input(z.object({ id: z.string(), message: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.update({
        where: {
          id: input.id
        },
        include: {
          likes: true
        },
        data: {
          message: input.message,
        }
      })
    }),
  deleteYap: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.delete({
        where: {
          id: input.id
        }
      })
    }),
});