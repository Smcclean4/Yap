import React from 'react'
import { LogoutForm } from './logout'
import { ChatMessenger } from './messenger'
import { UserInfoInterface } from '~/pages/friends';

interface SidebarNavInterface {
  user: string | undefined | null;
  userinfo?: UserInfoInterface;
  triggermessage?: boolean;
}

export const SidebarNav = ({ user, userinfo, triggermessage }: SidebarNavInterface) => {

  return (
    <div className="sm:flex flex-col justify-end w-min hidden h-full sm:h-auto absolute sm:static xl:w-1/6 text-center bg-gray-400">
      <ChatMessenger messengeruser={userinfo} trigger={triggermessage} />
      <div className="p-6">
        <LogoutForm />
        <p>Logged in as {user}</p>
      </div>
    </div>
  )
}