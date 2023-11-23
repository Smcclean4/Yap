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
    .input(z.object({ user: z.string(), id: z.string(), yapId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingYap = await ctx.prisma.yap.findUnique({
        where: {
          id: input.id
        },
        select: {
          message: true,
          options: true,
          likes: {
            select: {
              yapId: true
            }
          }
        }
      })

      // figured out solution to delete yap! but no since it is delete many 
      // it doesnt add like because it is delete current like as soon as it 
      // is placed?? 
      const result = await ctx.prisma.yap.upsert({
        include: {
          likes: true
        },
        create: {
          message: String(existingYap?.message),
          options: Boolean(existingYap?.options),
          likes: {
            create: {
              user: input.user
            }
          }
        },
        update: {
          likes: {
            delete: {
              // referencing this call for instructions on yaps.tsx
              yapId: input.yapId
            }
          }
        },
        where: {
          id: input.id
        }
      })

      return result
    })
});