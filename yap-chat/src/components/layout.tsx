import React, { ReactNode } from 'react'
import { TopNav } from './topnav'

type Props = {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {

  return (
    <div className="h-screen w-full">
      <TopNav />
      <div className="flex flex-row h-full">
        {children}
      </div>
    </div>
  )
}
