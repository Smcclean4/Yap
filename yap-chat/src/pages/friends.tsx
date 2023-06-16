import React, { useState } from 'react'
import { Layout } from '~/components/layout'

const FriendsPage = () => {

  interface FriendInterface {
    image: string;
    username: string;
    heading: string;
    message: boolean;
  }

  interface RequestInterface {
    image: string;
    username: string;
    approve: boolean;
    deny: boolean;
  }

  const friends: FriendInterface[] = [
    {
      image: '',
      username: '',
      heading: '',
      message: false
    },
    {
      image: '',
      username: '',
      heading: '',
      message: false
    },
    {
      image: '',
      username: '',
      heading: '',
      message: false
    },
    {
      image: '',
      username: '',
      heading: '',
      message: false
    }
  ]

  const [currentFriends, setCurrentFriends] = useState([])
  const [currentRequests, setCurrentRequests] = useState([])
  const [selectedTab, setSelectedTab] = useState(false)

  const handleSelectedTabClick = () => {
    setSelectedTab(!selectedTab)
  }

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28">
        <div className={`flex flex-row w-full justify-between h-full mt-2 ${selectedTab ? 'bg-gray-200' : 'bg-gray-800'}`}>
          <p className="bg-gray-200 w-1/2 h-16 text-black text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-700" onClick={selectedTab ? undefined : handleSelectedTabClick}>Friends</p>
          <p className="bg-gray-800 w-1/2 h-16 text-white text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-300" onClick={selectedTab ? handleSelectedTabClick : undefined}>Requests</p>
        </div>
      </div>
    </Layout>
  )
}

export default FriendsPage