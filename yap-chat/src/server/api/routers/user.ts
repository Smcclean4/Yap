import { z } from 'zod'

import {
    createTRPCRouter,
    publicProcedure
} from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
    searchUsers: publicProcedure
        .input(z.object({ query: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.user.findMany({
                where: {
                    name: { contains: input.query, mode: 'insensitive' }
                },
                take: 20
            })
        })
})