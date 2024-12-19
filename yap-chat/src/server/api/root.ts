import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { homeUpdatesRouter } from "./routers/home";
import { yapRouter } from "./routers/yaps";
import { friendsRouter } from "./routers/friends";
import { profileRouter } from "./routers/profile";
import { messengerRouter } from "./routers/messenger";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  home: homeUpdatesRouter,
  yap: yapRouter,
  friends: friendsRouter,
  profile: profileRouter,
  messenger: messengerRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
