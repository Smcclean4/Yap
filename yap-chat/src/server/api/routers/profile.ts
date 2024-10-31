import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id
        }
      })
    }),
  setUserProfile: publicProcedure.input(z.object({ id: z.string().optional(), name: z.string().optional().nullable(), heading: z.string().optional().nullable(), bio: z.string().optional().nullable(), image: z.string().optional().nullish() })).mutation(async ({ ctx, input }) => {
    const userProfile = await ctx.prisma.user.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name,
        heading: input.heading,
        bio: input.bio,
        image: input.image
      }
    })

    return userProfile
  })
});