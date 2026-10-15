import React from 'react'
import type { ReactNode } from 'react'
import { TopNav } from './topnav'
import Videoplayer from './videoplayer'

type Props = {
  children: ReactNode;
  video?: boolean;
}

export const Layout = ({ children, video = false }: Props) => {

  return (
    <div className={`${video ? 'relative bg-gray-900' : 'page-canvas'} flex h-screen w-full flex-col overflow-hidden`}>
      {video && (
        <>
          <Videoplayer
            url="https://mccleansid.wistia.com/medias/ttzeatf88i"
            className="pointer-events-none absolute inset-0 z-0 m-auto h-screen w-full"
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gray-900/20" />
        </>
      )}
      <div className="relative z-10">
        <TopNav />
      </div>
      <div className="relative z-10 flex min-h-0 flex-1 flex-row">
        {children}
      </div>
    </div>
  )
}
