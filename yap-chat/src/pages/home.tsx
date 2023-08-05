import { useSession } from 'next-auth/react';
import React from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import { api } from '~/utils/api';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingPage } from '~/shared/loading';

dayjs.extend(relativeTime)

const HomePage = () => {
  const { data: session } = useSession();

  if (!session) return null

  const RecentNews = () => {
    const { data, isLoading } = api.home.getHomeUpdates.useQuery()

    if (isLoading) return <LoadingPage />

    return (
      <>
        {data?.map((content, idx: React.Key | null | undefined) => {
          return (
            <div key={idx}>
              <p className="text-md md:text-2xl"><i className="underline">{content.heading}</i><span className="font-extralight">{` • ${dayjs(content.createdAt).fromNow()}`}</span></p>
              <p className="py-6 text-sm md:text-xl">{content.description}</p>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <Layout>
      <SidebarNav user={session?.user.email} />
      <div className="w-full flex flex-col justify-center items-center mt-28 sm:pt-10 bg-gray-200">
        <div className="w-3/4 text-sm sm:text-lg md:text-xl xl:text-2xl xl:leading-10 tracking-wider text-center">
          <p>Welcome to Yap, the chat application where you can message your friends and send out Yaps - opinionated global messages that allow you to share your thoughts and ideas with the world!</p>
          <br></br>
          <p>With Yap, you can stay connected with your friends and family, have private conversations, and also broadcast your views to a wider audience. Whether you want to share your latest project, your favorite song, or just your opinion on the latest news, Yap is the perfect platform to do it.</p>
        </div>
        <div className="text-center text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-12 font-bold bg-blue-500 px-10 py-4 rounded-tr-2xl rounded-tl-2xl">
          <p className="underline">Recent News</p>
        </div>
        <div className="bg-gray-900/[0.8] mb-2 h-72 w-5/6 lg:w-3/5 text-white flex flex-col justify-center items-center text-2xl overflow-auto rounded-lg">
          <div className="py-5 h-full w-4/5">
            <RecentNews />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage