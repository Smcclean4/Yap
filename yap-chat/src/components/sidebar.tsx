import React, { useState } from 'react'
import { LogoutForm } from './logout'
import { ChatMessenger } from './messenger'
import { UserInfoInterface } from '~/pages/friends';
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
      <div className={`flex flex-col justify-end w-min h-full sm:h-auto absolute sm:static xl:w-1/6 text-center bg-gray-400 ${hiddenTabIndicator ? '-translate-x-full' : 'translate-x-1/6'} sm:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <ChatMessenger messengeruser={userinfo} trigger={triggermessage} />
        <div className="p-6">
          <LogoutForm />
          <p>Logged in as {user}</p>
        </div>
      </div>
      <div className="sm:hidden flex flex-col justify-center items-center h-full z-50">
        <div className="h-auto bg-blue-500 rounded-tr-md rounded-br-md hover:cursor-pointer" onClick={() => setHiddenTabIndicator(!hiddenTabIndicator)}>
          <FontAwesomeIcon icon={hiddenTabIndicator ? faArrowRight : faArrowLeft} size="2xl" className="m-2 text-white" />
        </div>
      </div>
    </>
  )
}