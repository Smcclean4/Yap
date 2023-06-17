import { faCheck, faCircle, faPaperPlane, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Layout } from '~/components/layout'

const FriendsPage = () => {

  interface FriendInterface {
    image: string;
    username: string;
    heading: string;
    message: boolean;
    online: boolean;
  }

  interface RequestInterface {
    image: string;
    username: string;
    approve: boolean;
    deny: boolean;
  }

  const defaultFriends: FriendInterface[] = [
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend',
      heading: 'This is my default heading',
      message: false,
      online: true
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend',
      heading: 'This is my default heading',
      message: false,
      online: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend',
      heading: 'This is my default heading',
      message: false,
      online: true
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_friend',
      heading: 'This is my default heading',
      message: false,
      online: true
    }
  ]

  const defaultRequests: RequestInterface[] = [
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request',
      approve: false,
      deny: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request',
      approve: false,
      deny: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request',
      approve: false,
      deny: false
    },
    {
      image: '/ezgif.com-webp-to-jpg.jpg',
      username: '@default_request',
      approve: false,
      deny: false
    }
  ]

  const [currentFriends, setCurrentFriends]: Array<any> = useState([])
  const [currentRequests, setCurrentRequests]: Array<any> = useState([])
  const [selectedTab, setSelectedTab] = useState(true)

  const handleSelectedTabClick = () => {
    setSelectedTab(!selectedTab)
  }

  const onMessage = (idx: React.Key) => {
    // create message modal? where messages can be sent? conversations can be cleared?
    // creates new message component on sidenav with the current user that is being messaged
  }

  useEffect(() => {
    setCurrentFriends([...defaultFriends])
    setCurrentRequests([...defaultRequests])
  }, [])

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28">
        <div className={`flex flex-col w-full justify-between h-full mt-2 ${selectedTab ? 'bg-gray-200' : 'bg-gray-800'}`}>
          <div className="flex flex-row">
            <p className="bg-gray-200 w-1/2 h-16 text-black text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-700 font-extrabold" onClick={selectedTab ? undefined : handleSelectedTabClick}>Friends</p>
            <p className="bg-gray-800 w-1/2 h-16 text-white text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-300 font-extrabold" onClick={selectedTab ? handleSelectedTabClick : undefined}>Requests</p>
          </div>
          <div className="flex flex-row flex-grow justify-evenly flex-wrap content-start">
            {selectedTab ? currentFriends.map((friend: { image: string, username: string, heading: string }, idx: React.Key) => {
              return (
                <div key={idx} className="h-min flex flex-col text-center p-2 bg-gray-300 m-4 rounded-lg drop-shadow-2xl border-2 border-gray-200">
                  <div className="flex flex-row items-center justify-around">
                    <Image className="rounded-full" src={friend.image} alt={''} width="75" height="75" />
                    <p className="text-md">{currentFriends[idx].online ? 'Online' : 'Offline'}</p>
                    <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={currentFriends[idx].online ? 'limegreen' : 'gray'} size="sm" />
                  </div>
                  <p className="text-xl my-2 font-bold">{friend.username}</p>
                  <p className="text-lg font-light my-4">{friend.heading}</p>
                  <button onClick={() => onMessage(idx)} className="text-white text-lg bg-blue-500 py-2 rounded-lg my-4">Message <FontAwesomeIcon icon={faPaperPlane} color="white" size="sm" /></button>
                </div>
              )
            }) : currentRequests.map((request: { image: string, username: string }, idx: React.Key) => {
              return (
                <div key={idx} className="h-min flex text-center p-6 text-white m-4 bg-gray-700 rounded-lg items-center drop-shadow-2xl border-2 border-gray-600">
                  <Image className="rounded-full h-min mx-4" src={request.image} alt={''} width="75" height="75" />
                  <div className="flex flex-col ml-4">
                    <p className=" mb-2 text-lg font-semibold">{request.username}</p>
                    <div className="flex flex-row justify-around">
                      <button className="bg-gray-900 px-4 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faX} color="red" size="lg" /></button>
                      <button className="bg-gray-900 px-3.5 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faCheck} color="green" size="xl" /></button>
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