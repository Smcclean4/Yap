import { faCheck, faCircle, faEllipsis, faPaperPlane, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import { useModal } from '~/hooks/useModal';
import { DeleteModal } from '~/modals/delete';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api';
import { LoadingPage } from '~/shared/loading';
import { request } from 'http';

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

  const [currentFriends, setCurrentFriends]: Array<any> = useState([])
  const [currentRequests, setCurrentRequests]: Array<any> = useState([])
  const [userInfo, setUserInfo] = useState({ name: '', id: '' })
  const [messageInfo, setMessageInfo] = useState<MessageInfoInterface>({ username: '', message: '', online: false })
  const { isShowing, toggle } = useModal();
  const [selectedTab, setSelectedTab] = useState(true)
  const [messageTrigger, setMessageTrigger] = useState(false)
  const [options, setOptions] = useState<boolean[]>([])
  const { data: session } = useSession();

  const ctx = api.useContext()

  const optionsRef = useRef<HTMLDivElement>(null)
  const outerDivRef = useRef<HTMLDivElement>(null)

  const { data: friendsFromDatabase, isLoading: loadingFriends } = api.friends.getAllFriends.useQuery()
  const { data: requestFromDatabase, isLoading: loadingRequests } = api.friends.getAllRequests.useQuery()
  const { mutate: removeFriend } = api.friends.deleteFriend.useMutation({
    onSettled: () => {
      void ctx.yap.getAllYaps.invalidate();
    }
  })

  const handleSelectedTabClick = () => {
    setSelectedTab(!selectedTab)
  }

  const outerDivToggle = (element: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (optionsRef.current && !optionsRef.current.contains(element.target as Node)) {
      setOptions((boolArray) => boolArray.map((options, i) => {
        return options ? false : false
      }))
    }
  }


  const optionToggle = (element: React.MouseEvent<SVGSVGElement, MouseEvent>, idx?: React.Key) => {
    if (optionsRef.current && !optionsRef.current.contains(element.target as Node)) {
      setOptions((boolArray) => boolArray.map((options, i) => {
        return i === idx ? false : options
      }))
    } else {
      setOptions((boolArray) => boolArray.map((options, i) => {
        return i === idx ? true : options
      }))
    }
  }

  const currentUserData = (ctx: string, id: string) => {
    setUserInfo({ name: ctx, id: id })
  }

  const onRemoveFriend = () => {
    if (selectedTab) {
      toggle()
    }
  }

  const deleteFriend = () => {
    removeFriend({ id: userInfo.id })
    toast.error(`${userInfo} removed as a friend.`)
    toggle()
  }

  const onMessage = (idx: React.Key) => {
    setMessageInfo({ username: userInfo.name, message: 'cash flow cash flow', online: currentFriends[idx].online })
    // trigger message modal from messenger
    setMessageTrigger(!messageTrigger)
  }

  const onRequestDeny = () => {
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
    toast.error(`${userInfo} request denied.`)
    toggle()
  }

  const addOption = () => {
    setOptions([...options, false])
  }


  const approveRequest = (idx: React.Key) => {
    setCurrentRequests((state: any[]) => state.filter((request: RequestInterface, i: React.Key) => {
      if (currentRequests[i].username === userInfo) {
        return false
      } else {
        return request
      }
    }))
    addOption()
    // needs delay to filter approved request from current requests?
    toast.success(`${userInfo} request approved! `)
    setCurrentFriends([...currentFriends, currentRequests[idx]])
  }

  const requestTotal = (ctx: string | any[] | undefined) => {
    return ctx?.length
  }

  useEffect(() => {
    const optionsFromLocalStorage = JSON.parse(localStorage.getItem("options") || "[]");
    if (options.length === 0) {
      setOptions(optionsFromLocalStorage)
    } else if (optionsFromLocalStorage.length === 0) {
      friendsFromDatabase?.forEach(() => {
        setOptions([...options, false])
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  if (!session) return null;

  const DisplayCurrentFriends = () => {

    if (loadingFriends) return <LoadingPage />

    return (
      <>
        {friendsFromDatabase?.map((friend: any, idx: any) => {
          return (
            <div key={idx} className="h-min flex flex-col text-center p-2 bg-gray-300 m-4 rounded-lg drop-shadow-2xl border-2 border-gray-200">
              <div className="flex justify-end">
                <FontAwesomeIcon className="cursor-pointer" onClick={(element) => {
                  optionToggle(element, idx)
                  currentUserData(friend.name, friend.id)
                }} icon={faEllipsis} size="xl" tabIndex={0} />
                {options[idx] && (
                  <div className="absolute bg-gray-700 text-white" ref={optionsRef}>
                    <button className="p-2" onMouseDown={onRemoveFriend}>Remove Friend</button>
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center justify-around">
                <Image className="rounded-full" src={`${friend.image}`} alt={''} width="75" height="75" />
                <p className="text-md">{friend.online ? 'Online' : 'Offline'}</p>
                <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={friend.online ? 'limegreen' : 'gray'} size="sm" />
              </div>
              <p className="text-xl my-2 font-bold">{friend.name}</p>
              <p className="text-lg font-light my-4">{friend.heading}</p>
              <button onClick={() =>
                onMessage(idx)} onFocus={() => currentUserData(friend.name, friend.id)} className="text-white text-lg bg-blue-500 py-2 rounded-lg my-4">Message <FontAwesomeIcon icon={faPaperPlane} color="white" size="sm" /></button>
            </div>
          )
        })}
      </>
    )
  }

  const DisplayCurrentRequests = () => {

    if (loadingRequests) return <LoadingPage />

    return (
      <>
        {requestFromDatabase?.map((request: any, idx: React.Key) => {
          return (
            <div key={idx} className="h-min flex text-center p-6 text-white m-4 bg-gray-700 rounded-lg items-center drop-shadow-2xl border-2 border-gray-600">
              <Image className="rounded-full h-min mx-4" src={request.image} alt={''} width="75" height="75" />
              <div className="flex flex-col ml-4">
                <p className=" mb-2 text-lg font-semibold">{request.name}</p>
                <div className="flex flex-row justify-around">
                  <button onClick={onRequestDeny} onFocus={() => currentUserData(request.name, request.id)} className="bg-gray-900 m-2 px-4 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faX} color="red" size="lg" /></button>
                  <button onClick={() => approveRequest(idx)} onFocus={() => currentUserData(request.name, request.id)} className="bg-gray-900 m-2 px-3.5 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faCheck} color="green" size="xl" /></button>
                </div>
              </div>
            </div>
          )
        })}
      </>
    )

  }

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} userinfo={messageInfo} triggermessage={messageTrigger} />
      <div className="w-full flex flex-col justify-center items-center mt-28" onClick={(element) => outerDivToggle(element)}>
        <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={selectedTab ? deleteFriend : deleteRequest} item={userInfo.name} theme={selectedTab ? 'bg-white' : 'bg-gray-900'} text={selectedTab ? 'text-black' : 'text-white'} />
        <div className={`flex flex-col w-full justify-between h-full mt-2 ${selectedTab ? 'bg-gray-200' : 'bg-gray-800'} overflow-scroll no-scrollbar overflow-y-auto`} ref={outerDivRef}>
          <div className="flex flex-row">
            <p className="bg-gray-200 w-1/2 h-16 text-black text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-700 font-extrabold" onClick={selectedTab ? undefined : handleSelectedTabClick}>Friends<span className="mx-2 font-light text-md">(Friends: {requestTotal(friendsFromDatabase)})</span></p>
            <p className="bg-gray-800 w-1/2 h-16 text-white text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-300 font-extrabold" onClick={selectedTab ? handleSelectedTabClick : undefined}>Requests<span className="text-md font-semibold rounded-full bg-red-500 px-3 py-1 mx-2">{requestTotal(requestFromDatabase)}</span></p>
          </div>
          <div className="flex flex-row flex-grow justify-evenly flex-wrap content-start">
            {selectedTab ? <DisplayCurrentFriends /> : <DisplayCurrentRequests />}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FriendsPage