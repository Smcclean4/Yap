import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const yapRouter = createTRPCRouter({
  getAllYaps: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.yap.findMany({
      include: {
        likes: true,
      },
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  findSpecificUserLikes: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.yap.findMany({
        include: {
          likes: true,
        },
        where: {
          likes: {
            some: {
              user: input.text,
            },
          },
        },
      });
    }),
  postYap: publicProcedure
    .input(
      z.object({ message: z.string(), user: z.string(), image: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.create({
        include: {
          likes: true,
        },
        data: {
          message: input.message,
          user: input.user,
          image: input.image,
        },
      });
    }),
  likeYap: publicProcedure
    .input(z.object({ user: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          yapId: input.id,
          user: input.user,
        },
      });

      if (existingLike) {
        await ctx.prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        await ctx.prisma.like.create({
          data: {
            yapId: input.id,
            user: input.user,
          },
        });
      }

      return ctx.prisma.yap.findUnique({
        where: {
          id: input.id,
        },
        include: {
          likes: true,
        },
      });
    }),
  editYap: publicProcedure
    .input(z.object({ id: z.string(), message: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.update({
        where: {
          id: input.id,
        },
        include: {
          likes: true,
        },
        data: {
          message: input.message,
        },
      });
    }),
  deleteYap: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.yap.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
