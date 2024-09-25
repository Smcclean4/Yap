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
  setUserProfile: publicProcedure.input(z.object({ id: z.string(), name: z.string(), heading: z.string(), bio: z.string(), image: z.string() })).mutation(async ({ ctx, input }) => {
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