import React, { useState } from 'react'
import { LogoutForm } from './logout'
import { ChatMessenger } from './messenger'
import type { UserInfoInterface } from '~/pages/friends';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface SidebarNavInterface {
  user: string | undefined | null;
  userinfo?: UserInfoInterface;
  triggermessage?: boolean;
}

export const SidebarNav = ({ user, userinfo, triggermessage }: SidebarNavInterface) => {

  const [hiddenTabIndicator, setHiddenTabIndicator] = useState(true);

  return (
    <>
      <div className={`absolute z-40 flex h-full w-min flex-col justify-end bg-gray-800 text-center text-white shadow-2xl transition-transform duration-300 ease-in-out sm:static sm:h-auto xl:w-72 ${hiddenTabIndicator ? '-translate-x-full' : 'translate-x-1/6'} sm:translate-x-0`}>
        <div className="hidden border-b border-white/10 px-5 py-4 text-left sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yap-gold">Messages</p>
          <p className="mt-1 text-lg font-bold">Your chats</p>
        </div>
        <ChatMessenger messengeruser={userinfo} trigger={triggermessage} />
        <div className="border-t border-white/10 p-5">
          <LogoutForm />
          <p className="mt-3 truncate text-xs text-gray-300">Logged in as {user}</p>
        </div>
        <div className="absolute -right-11 z-40 flex h-full flex-col items-center justify-center sm:hidden">
          <div className="h-auto cursor-pointer rounded-br-md rounded-tr-md bg-blue-500 shadow-lg shadow-blue-500/40" onClick={() => setHiddenTabIndicator(!hiddenTabIndicator)}>
            <FontAwesomeIcon icon={hiddenTabIndicator ? faArrowRight : faArrowLeft} size="2xl" className="m-2 text-white" />
          </div>
        </div>
      </div>
    </>
  )
}
