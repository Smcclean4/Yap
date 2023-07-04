import React from 'react'
import { LogoutForm } from './logout'
import { ChatMessenger } from './messenger'
import { MessageInfoInterface } from '~/pages/friends';

interface SidebarNavInterface {
  user: string | undefined | null;
  userinfo?: MessageInfoInterface;
}

export const SidebarNav = ({ user, userinfo }: SidebarNavInterface) => {
  return (
    <div className="flex flex-col justify-end w-min xl:w-1/6 text-center bg-gray-400">
      <ChatMessenger messengeruser={userinfo} />
      <div className="p-6">
        <LogoutForm />
        <p>Logged in as {user}</p>
      </div>
    </div>
  )
}