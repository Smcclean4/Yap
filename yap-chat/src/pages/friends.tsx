import { faCheck, faCircle, faEllipsis, faPaperPlane, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import { useModal } from '~/hooks/useModal';
import { DeleteModal } from '~/modals/delete';
import { MessageModal } from '~/modals/message';

export interface MessageInfoInterface {
  username: string;
  message: string;
  online: boolean;
}

const FriendsPage = () => {

  interface FriendInterface {
    image: string;
    username: string;
    heading: string;
    message: boolean;
    online: boolean;
    options: boolean;
  }

  interface RequestInterface {
    image: string;
    username: string;
    heading: string;
    message: boolean;
    online: boolean;
    options: boolean;
  }


  const defaultFriends: FriendInterface[] = [
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend1',
      heading: 'This is my default heading',
      message: false,
      online: true,
      options: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend2',
      heading: 'This is my default heading',
      message: false,
      online: false,
      options: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend3',
      heading: 'This is my default heading',
      message: false,
      online: true,
      options: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend4',
      heading: 'This is my default heading',
      message: false,
      online: true,
      options: false
    }
  ]

  const defaultRequests: RequestInterface[] = [
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request1',
      heading: 'This is my default heading',
      message: false,
      online: false,
      options: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request2',
      heading: 'This is my default heading',
      message: false,
      online: false,
      options: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request3',
      heading: 'This is my default heading',
      message: false,
      online: false,
      options: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request4',
      heading: 'This is my default heading',
      message: false,
      online: false,
      options: false
    }
  ]

  const [currentFriends, setCurrentFriends]: Array<any> = useState([])
  const [currentRequests, setCurrentRequests]: Array<any> = useState([])
  const [userInfo, setUserInfo] = useState('')
  const [messageInfo, setMessageInfo] = useState<MessageInfoInterface>({ username: '', message: '', online: false })
  const [trueMessageFalseRemoveFriend, setTrueMessageFalseRemoveFriend] = useState(false)
  const { isShowing, toggle } = useModal();
  const [selectedTab, setSelectedTab] = useState(true)

  const { data: session } = useSession();

  const handleSelectedTabClick = () => {
    setSelectedTab(!selectedTab)
  }

  const onEditFriend = (idx: React.Key) => {
    setCurrentFriends((state: { options: boolean }[]) => state?.map((friend: { options: boolean }, i: React.Key) => {
      return i === idx ? { ...friend, options: !friend.options } : friend
    }))
  }

  const currentUserData = (ctx: string) => {
    setUserInfo(ctx)
  }

  const onRemoveFriend = () => {
    setTrueMessageFalseRemoveFriend(false)
    if (selectedTab) {
      toggle()
    }
  }

  const deleteFriend = () => {
    setCurrentFriends((state: any[]) => state.filter((friend: FriendInterface, i: React.Key) => {
      if (currentFriends[i].username === userInfo) {
        return false
      } else {
        return friend
      }
    }))
    toggle()
  }

  // INTEGRATE UPDATE MESSENGER HERE?
  // const itemExists = (username: string | undefined) => {
  //   return chats.some((chat: { username: any; }) => {
  //     return chat?.username === username
  //   })
  // }

  // const updateMessenger = () => {
  //   if (itemExists(messengeruser?.username)) {
  //     return
  //   } else {
  //     setChats([...chats, messengeruser])
  //   }
  // }

  const onMessage = (idx: React.Key) => {
    setTrueMessageFalseRemoveFriend(true)
    setMessageInfo({ username: userInfo, message: 'cash flow cash flow', online: currentFriends[idx].online })
    if (selectedTab) {
      toggle();
    }
  }

  const onMessageSend = () => {
    alert('attempting to send message!')
  }

  const onRequestDeny = () => {
    setTrueMessageFalseRemoveFriend(false)
    if (!selectedTab) {
      toggle()
    }
  }

  const deleteRequest = () => {
    setCurrentRequests((state: any[]) => state.filter((request: RequestInterface, i: React.Key) => {
      if (currentRequests[i].username === userInfo) {
        return false
      } else {
        return request
      }
    }))
    toggle()
  }

  const approveRequest = (idx: React.Key) => {
    setCurrentRequests((state: any[]) => state.filter((request: RequestInterface, i: React.Key) => {
      if (currentRequests[i].username === userInfo) {
        return false
      } else {
        return request
      }
    }))
    // needs delay to filter approved request from current requests?
    alert('approving request!')
    // filter out the approved request and then add the requested person to the current friends list.
    setCurrentFriends([...currentFriends, currentRequests[idx]])
  }

  const requestTotal = (ctx: string | any[]) => {
    return ctx.length
  }

  useEffect(() => {
    setCurrentFriends([...defaultFriends])
    setCurrentRequests([...defaultRequests])
  }, [])

  return (
    <Layout>
      <SidebarNav user={session?.user.email} userinfo={messageInfo} />
      <div className="w-full flex flex-col justify-center items-center mt-28">
        {trueMessageFalseRemoveFriend ? (
          <MessageModal isShowing={isShowing} hide={toggle} sendmessage={onMessageSend} messages={'user messages here'} user={userInfo} />
        ) : (
          <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={selectedTab ? deleteFriend : deleteRequest} item={userInfo} theme={selectedTab ? 'bg-white' : 'bg-gray-900'} text={selectedTab ? 'text-black' : 'text-white'} />
        )}
        <div className={`flex flex-col w-full justify-between h-full mt-2 ${selectedTab ? 'bg-gray-200' : 'bg-gray-800'} overflow-scroll no-scrollbar overflow-y-auto`}>
          <div className="flex flex-row">
            <p className="bg-gray-200 w-1/2 h-16 text-black text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-700 font-extrabold" onClick={selectedTab ? undefined : handleSelectedTabClick}>Friends<span className="mx-2 font-light text-md">(Friends: {requestTotal(currentFriends)})</span></p>
            <p className="bg-gray-800 w-1/2 h-16 text-white text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-300 font-extrabold" onClick={selectedTab ? handleSelectedTabClick : undefined}>Requests<span className="text-md font-semibold rounded-full bg-red-500 px-3 py-1 mx-2">{requestTotal(currentRequests)}</span></p>
          </div>
          <div className="flex flex-row flex-grow justify-evenly flex-wrap content-start">
            {selectedTab ? currentFriends.map((friend: { image: string, username: string, heading: string }, idx: React.Key) => {
              return (
                <div key={idx} className="h-min flex flex-col text-center p-2 bg-gray-300 m-4 rounded-lg drop-shadow-2xl border-2 border-gray-200">
                  <div className="flex justify-end">
                    <FontAwesomeIcon className="cursor-pointer" onFocus={() => {
                      onEditFriend(idx)
                      currentUserData(currentFriends[idx].username)
                    }} icon={faEllipsis} size="xl" tabIndex={0} onBlur={() => onEditFriend(idx)} />
                    {currentFriends[idx].options && (
                      <div className="absolute bg-gray-700 text-white">
                        <button className="p-2" onMouseDown={onRemoveFriend}>Remove Friend</button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-around">
                    <Image className="rounded-full" src={friend.image} alt={''} width="75" height="75" />
                    <p className="text-md">{currentFriends[idx].online ? 'Online' : 'Offline'}</p>
                    <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={currentFriends[idx].online ? 'limegreen' : 'gray'} size="sm" />
                  </div>
                  <p className="text-xl my-2 font-bold">{friend.username}</p>
                  <p className="text-lg font-light my-4">{friend.heading}</p>
                  <button onClick={() => onMessage(idx)} onFocus={() => currentUserData(currentFriends[idx].username)} className="text-white text-lg bg-blue-500 py-2 rounded-lg my-4">Message <FontAwesomeIcon icon={faPaperPlane} color="white" size="sm" /></button>
                </div>
              )
            }) : currentRequests.map((request: { image: string, username: string }, idx: React.Key) => {
              return (
                <div key={idx} className="h-min flex text-center p-6 text-white m-4 bg-gray-700 rounded-lg items-center drop-shadow-2xl border-2 border-gray-600">
                  <Image className="rounded-full h-min mx-4" src={request.image} alt={''} width="75" height="75" />
                  <div className="flex flex-col ml-4">
                    <p className=" mb-2 text-lg font-semibold">{request.username}</p>
                    <div className="flex flex-row justify-around">
                      <button onClick={onRequestDeny} onFocus={() => currentUserData(currentRequests[idx].username)} className="bg-gray-900 px-4 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faX} color="red" size="lg" /></button>
                      <button onClick={() => approveRequest(idx)} onFocus={() => currentUserData(currentRequests[idx].username)} className="bg-gray-900 px-3.5 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faCheck} color="green" size="xl" /></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FriendsPage