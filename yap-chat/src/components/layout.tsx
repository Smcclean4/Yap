import React, { ReactNode } from 'react'
import { TopNav } from './topnav'
import { SidebarNav } from './sidebar'
import { useSession } from 'next-auth/react'

type Props = {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { data: session } = useSession();

  return (
    <div className="h-screen w-full">
      <TopNav />
      <div className="h-full flex flex-row">
        <SidebarNav user={session?.user.email} />
        {children}
      </div>
    </div>
  )
}
