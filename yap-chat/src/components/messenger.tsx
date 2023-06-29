import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { MessageInfoInterface } from '~/pages/friends';

interface MessengerInterface {
  messengeruser?: MessageInfoInterface;
}

export const ChatMessenger = ({ messengeruser }: MessengerInterface) => {
  // when chat is open.. make new chat messenger in sidebar nav.
  // when messenger open button is clicked open modal with corresponding chat.

  const [chats, setChats]: Array<any> = useState([])

  useEffect(() => {
    const chatsStorage = JSON.parse(localStorage.getItem('chatsData') || '[]')
    if (chatsStorage) {
      setChats(chatsStorage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatsData', JSON.stringify(chats))
  }, [chats])

  return (
    <div className="flex flex-col flex-grow mt-20 overflow-scroll no-scrollbar overflow-y-auto">
      {chats?.map((chats: { username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; online: any; message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, idx: React.Key) => {
        return (
          <div key={idx} className="text-white bg-gray-900 w-full py-3 h-min border-b-2 border-gray-300">
            <div className="flex flex-row justify-around items-center">
              <p className="text-xl">{chats?.username}</p>
              <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={chats?.online ? 'limegreen' : 'gray'} size="sm" />
            </div>
            <div className="font-extralight italic">
              <p>{chats?.message}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
