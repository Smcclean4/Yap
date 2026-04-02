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
import { api, type RouterOutputs } from '~/utils/api';
import { LoadingPage } from '~/shared/loading';
import FindUserPage from '~/components/finduser';
import { useChatContext } from '~/contexts/ChatContext';

export interface UserInfoInterface {
  name: string;
  image: string;
  online: boolean;
  heading: string;
  id: string;
  friendId?: string | null;
}

type FriendRow = RouterOutputs['friends']['getAllFriends'][number];
type RequestRow = RouterOutputs['friends']['getAllRequests'][number];

function parseStoredUserInfo(raw: string | null): UserInfoInterface {
  const empty: UserInfoInterface = {
    name: '',
    image: '',
    heading: '',
    id: '',
    online: false,
    friendId: '',
  };
  if (!raw) return empty;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return empty;
    const p = parsed as Partial<UserInfoInterface>;
    return { ...empty, ...p, id: String(p.id ?? ''), friendId: p.friendId != null ? String(p.friendId) : '' };
  } catch {
    return empty;
  }
}

const FriendsPage = () => {

  const [userInfo, setUserInfo] = useState<UserInfoInterface>(() => {
    if (typeof window !== 'undefined') {
      return parseStoredUserInfo(localStorage.getItem('selectedMessenger'));
    }
    return { name: '', image: '', heading: '', id: '', online: false, friendId: '' };
  })
  const { isShowing, toggle } = useModal();
  const [selectedTab, setSelectedTab] = useState(true)
  const [messageTrigger, setMessageTrigger] = useState(false)
  const [options, setOptions] = useState<boolean[]>([])
  const { data: session } = useSession();
  const { isUserOnline } = useChatContext();

  const ctx = api.useContext()

  const optionsRef = useRef<HTMLDivElement>(null)
  const outerDivRef = useRef<HTMLDivElement>(null)

  // maybe sending friends from database down to message and then pulling that data might be more reliable?
  const { data: friendsFromDatabase, isLoading: loadingFriends } = api.friends.getAllFriends.useQuery()
  const { data: requestFromDatabase, isLoading: loadingRequests } = api.friends.getAllRequests.useQuery()
  const { mutate: removeFriend } = api.friends.deleteFriend.useMutation({
    onSettled: () => {
      void ctx.friends.getAllFriends.invalidate();
    }
  })
  const { mutate: removeRequest } = api.friends.deleteRequest.useMutation({
    onSettled: () => {
      void ctx.friends.getAllRequests.invalidate();
    }
  })
  const { mutate: approveFriend } = api.friends.approveRequest.useMutation({
    onSettled: () => {
      void ctx.friends.getAllRequests.invalidate();
      void ctx.friends.getAllFriends.invalidate();
    }
  })

  const handleSelectedTabClick = () => {
    setSelectedTab(!selectedTab)
  }

  const currentUserData = (
    name: string,
    image: string,
    online: boolean,
    heading: string,
    id: string,
    friendId?: string | null
  ) => {
    const newUserInfo: UserInfoInterface = {
      name,
      image,
      online,
      heading,
      id,
      friendId: friendId ?? '',
    };
    setUserInfo(newUserInfo);
    // Save to localStorage for persistence, but only in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedMessenger', JSON.stringify(newUserInfo));
    }
  }

  const outerDivToggle = (element: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (optionsRef.current && !optionsRef.current.contains(element.target as Node)) {
      setOptions((boolArray) => boolArray.map(() => false))
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

  const onRemoveFriend = () => {
    if (selectedTab) {
      toggle()
    }
  }

  const deleteFriend = () => {
    removeFriend({ id: userInfo.id })
    toast.error(`${userInfo.name} removed as a friend.`)
    // Clear the selected messenger if it's the one being removed, but only in browser
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedMessenger');
    }
    setUserInfo({ name: '', image: '', heading: '', id: '', online: false });
    toggle()
  }

  const onMessage = () => {
    setMessageTrigger(true)
    // Reset the trigger after a short delay to allow the modal to open
    setTimeout(() => setMessageTrigger(false), 100)
  }

  const onRequestDeny = () => {
    if (!selectedTab) {
      toggle()
    }
  }

  const deleteRequest = () => {
    removeRequest({ id: userInfo.id })
    toast.error(`${userInfo.name} request denied.`)
    toggle()
  }

  const addOption = () => {
    setOptions([...options, false])
  }


  const approveRequest = () => {
    if (userInfo.id && userInfo.id !== "undefined" && session?.user?.id) {
      approveFriend({ name: userInfo.name, image: userInfo.image, online: userInfo.online, heading: userInfo.heading, id: userInfo.id })
      addOption()
      // Note: We don't call removeRequest here because approving changes the status to ACCEPTED,
      // which automatically removes it from the requests list (getAllRequests only shows PENDING)
    } else {
      toast.error(`Was not able to add ${userInfo.name} as a friend.`)
    }
  }

  const requestTotal = (rows: readonly unknown[] | undefined) => rows?.length ?? 0

  // Sync options from localStorage once; avoid deps that would re-run on every friends load
  useEffect(() => {
    const raw = localStorage.getItem("options") || "[]";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    const optionsFromLocalStorage = Array.isArray(parsed)
      ? parsed.filter((x): x is boolean => typeof x === "boolean")
      : [];
    if (options.length === 0) {
      setOptions(optionsFromLocalStorage);
    } else if (optionsFromLocalStorage.length === 0) {
      friendsFromDatabase?.forEach(() => {
        setOptions((prev) => [...prev, false]);
      });
    }
    console.log(friendsFromDatabase);
    console.log(userInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hydration from localStorage
  }, [])

  // local storage for userinfo isnt the current problem find the real issue
  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  if (!session) return null;

  const DisplayCurrentFriends = () => {

    if (loadingFriends) return <LoadingPage />

    return (
      <>
        {friendsFromDatabase?.map((friend: FriendRow, idx: number) => {
          const liveOnline = isUserOnline(friend.friendId ?? undefined);
          return (
            <div key={friend.id} className="h-min flex flex-col text-center p-2 bg-gray-300 m-4 rounded-lg drop-shadow-2xl border-2 border-gray-200">
              <div className="flex justify-end">
                <FontAwesomeIcon className="cursor-pointer" onMouseDown={() => currentUserData(
                  friend.name ?? '',
                  friend.image ?? '',
                  liveOnline,
                  friend.heading ?? '',
                  friend.id,
                  friend.friendId
                )} onMouseUp={(element) => {
                  optionToggle(element, idx)
                }} icon={faEllipsis} size="xl" tabIndex={0} />
                {options[idx] && (
                  <div className="absolute bg-gray-700 text-white" ref={optionsRef}>
                    <button className="p-2" onClick={onRemoveFriend}>Remove Friend</button>
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center justify-around">
                <Image className="rounded-full object-cover aspect-square border-4 border-blue-500 shadow-lg" src={friend.image ?? ''} alt={'friend image'} width={125} height={125} />
                <p className="text-md">{liveOnline ? 'Online' : 'Offline'}</p>
                <FontAwesomeIcon className="border-2 border-gray-100 rounded-full" icon={faCircle} color={liveOnline ? 'limegreen' : 'gray'} size="sm" />
              </div>
                <p className="text-xl my-2 font-bold">{friend.name}</p>
                <p className="text-lg font-light my-4 w-64">{friend.heading}</p>
              <button onClick={() => {
                currentUserData(
                  friend.name ?? '',
                  friend.image ?? '',
                  liveOnline,
                  friend.heading ?? '',
                  friend.id,
                  friend.friendId
                )
                onMessage()
              }
              } className="text-white text-lg bg-blue-500 py-2 rounded-lg my-4">Message <FontAwesomeIcon icon={faPaperPlane} color="white" size="sm" /></button>
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
        {requestFromDatabase?.map((request: RequestRow) => {
          return (
            <div key={request.id} className="h-min flex text-center p-6 text-white m-4 bg-gray-700 rounded-lg items-center drop-shadow-2xl border-2 border-gray-600">
              <Image className="rounded-full h-min mx-4" src={request.image ?? ''} alt={''} width={75} height={75} />
              <div className="flex flex-col ml-4">
                <p className=" mb-2 text-lg font-semibold">{request.name}</p>
                <div className="flex flex-row justify-around">
                  <button onMouseDown={() => currentUserData(
                    request.name ?? '',
                    request.image ?? '',
                    request.online,
                    request.heading ?? '',
                    request.id,
                    request.friendId
                  )} onMouseUp={onRequestDeny} className="bg-gray-900 m-2 px-4 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faX} color="red" size="lg" /></button>
                  <button onMouseDown={() => currentUserData(
                    request.name ?? '',
                    request.image ?? '',
                    request.online,
                    request.heading ?? '',
                    request.id,
                    request.friendId
                  )} onMouseUp={() => approveRequest()} className="bg-gray-900 m-2 px-3.5 py-3 rounded-full cursor-pointer"><FontAwesomeIcon icon={faCheck} color="green" size="xl" /></button>
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
      <SidebarNav user={session?.user.email} userinfo={userInfo} triggermessage={messageTrigger} />
      <div className="w-full flex flex-col justify-center items-center" onClick={(element) => outerDivToggle(element)}>
        <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={selectedTab ? deleteFriend : deleteRequest} item={userInfo.name} theme={selectedTab ? 'bg-white' : 'bg-gray-900'} text={selectedTab ? 'text-black' : 'text-white'} />
        <div className={`flex flex-col w-full justify-between h-full ${selectedTab ? 'bg-gray-200' : 'bg-gray-800'} overflow-scroll no-scrollbar overflow-y-auto`} ref={outerDivRef}>
          <div className="flex flex-row">
            <p className="bg-gray-200 w-1/2 h-16 text-black text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-700 font-extrabold" onClick={selectedTab ? undefined : handleSelectedTabClick}>Friends<span className="mx-2 font-light text-md">(Friends: {requestTotal(friendsFromDatabase)})</span></p>
            <p className="bg-gray-800 w-1/2 h-16 text-white text-center flex items-center justify-center text-2xl cursor-pointer hover:text-gray-300 font-extrabold" onClick={selectedTab ? handleSelectedTabClick : undefined}>Requests<span className="text-md font-semibold rounded-full bg-red-500 px-3 py-1 mx-2">{requestTotal(requestFromDatabase)}</span></p>
          </div>
          <div className="flex flex-row flex-grow justify-evenly flex-wrap content-start">
            {selectedTab ? null : <FindUserPage />}
            {selectedTab ? <DisplayCurrentFriends /> : <DisplayCurrentRequests />}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FriendsPage