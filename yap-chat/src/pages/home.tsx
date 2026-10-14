import { useSession } from 'next-auth/react';
import React from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import { api, type RouterOutputs } from '~/utils/api';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage } from '~/shared/loading';

dayjs.extend(relativeTime)

type HomeUpdate = RouterOutputs['home']['getHomeUpdates'][number];

const HomePage = () => {
  const { data: session } = useSession();

  if (!session) return null

  const RecentNews = () => {
    const { data, isLoading } = api.home.getHomeUpdates.useQuery()

    if (isLoading) return <LoadingPage />

    if (!data?.length) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-gray-300">
          <p className="text-lg font-semibold">No news yet</p>
          <p className="mt-1 text-sm">Fresh Yaps and friend activity will show up here.</p>
        </div>
      )
    }

    return (
      <>
        {data?.map((content: HomeUpdate, idx: number) => {
          return (
            <div key={content.id ?? idx} className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4 last:mb-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-lg font-bold text-white md:text-2xl">{content.heading}</p>
                <span className="text-sm font-light text-yap-gold">{dayjs(content.createdAt).fromNow()}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-200 md:text-lg">{content.description}</p>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <Layout video>
      <SidebarNav user={session?.user.email} />
      <div className="flex h-auto min-h-0 w-full flex-col items-center justify-around overflow-scroll py-10 lg:flex-row">
        <div className="surface-card animate-rise w-4/5 p-8 text-center tracking-wide lg:w-2/5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">Welcome back</p>
          <p className="mt-3 text-4xl font-extrabold">Yap.</p>
          <div className="accent-bar mx-auto my-4" />
          <p className="text-sm leading-7 text-gray-700 sm:text-lg md:text-xl xl:text-2xl xl:leading-10">
            Welcome to Yap, the chat application where you can message your friends and send out Yaps - opinionated global messages that allow you to share your thoughts and ideas with the world!
          </p>
          <p className="mt-6 text-sm leading-7 text-gray-700 sm:text-lg md:text-xl xl:text-2xl xl:leading-10">
            With Yap, you can stay connected with your friends and family, have private conversations, and also broadcast your views to a wider audience. Whether you want to share your favorite song, or just your opinion on the latest news, Yap is the perfect platform to do it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="chip">Private chats</span>
            <span className="chip border-yellow-200 bg-yellow-50 text-yellow-700">Global Yaps</span>
            <span className="chip">Friend network</span>
          </div>
        </div>
        <div className="mt-10 flex h-full w-3/4 flex-col lg:mt-0 lg:w-2/5">
          <div className="rounded-t-2xl bg-blue-500 px-10 py-4 text-center text-xl font-bold text-white shadow-lg shadow-blue-500/30 sm:text-2xl md:text-3xl lg:text-4xl">
            <p>Recent News</p>
            <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-yap-gold" />
          </div>
          <div className="surface-dark mb-2 h-full w-full overflow-auto rounded-t-none p-4">
            <RecentNews />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage
