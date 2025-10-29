import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  getAllFriends: publicProcedure.input(z.object({
    userId: z.string()
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.friendships.findMany({
      where: {
        friendId: input.userId,
        status: 'ACCEPTED'
      },
      take: 50,
      include: {
        friends: true
      }
    })
  }),
  getAllRequests: publicProcedure.input(z.object({
    userId: z.string()
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.friendships.findMany({
      where: {
        friendsWithId: input.userId,
        status: 'PENDING'
      },
      take: 50,
      include: {
        friendsWith: true
      }
    })
  }),
  findSpecificFriend: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.findMany({
        where: {
          friends: {
            name: input.name
          }
        }
      })
    }),
  deleteFriend: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.delete({
        where: {
          id: input.id
        }
      })
    }),
  approveRequest: publicProcedure
    .input(z.object({ name: z.string(), image: z.string(), online: z.boolean(), heading: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      // Create a friend record that references the current user (the one approving the request)
      return ctx.prisma.friendships.update({
        where: {
          id: input.id
        },
        data: {
          friends: {
            create: {
              name: input.name,
              image: input.image,
              online: input.online ? "ONLINE" : "OFFLINE",
              heading: input.heading
            }
          }
        }
      })
    }),
  deleteRequest: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friendships.delete({
        where: {
          id: input.id
        }
      })
    })
});