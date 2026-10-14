import { faCheck, faCircle, faEllipsis, faPaperPlane, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
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

type FriendCardsProps = {
  friends: FriendRow[] | undefined;
  loading: boolean;
  openMenuId: string | null;
  isUserOnline: (friendId?: string | null) => boolean;
  onSelectFriend: (friend: FriendRow, online: boolean) => void;
  onToggleMenu: (event: React.MouseEvent, id: string) => void;
  onRemoveFriend: () => void;
  onMessage: () => void;
};

const FriendCards = ({ friends, loading, openMenuId, isUserOnline, onSelectFriend, onToggleMenu, onRemoveFriend, onMessage }: FriendCardsProps) => {
  if (loading) return <LoadingPage />

  return (
    <>
      {friends?.map((friend: FriendRow) => {
        const liveOnline = isUserOnline(friend.friendId ?? undefined);
        return (
          <div key={friend.id} className="surface-card relative z-10 m-4 flex h-min w-72 flex-col overflow-visible p-4 text-center transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative z-20 flex justify-end">
              <button
                type="button"
                className="cursor-pointer text-gray-500 hover:text-gray-800"
                aria-label={`Options for ${friend.name ?? 'friend'}`}
                onClick={(event) => {
                  onSelectFriend(friend, liveOnline)
                  onToggleMenu(event, friend.id)
                }}
              >
                <FontAwesomeIcon icon={faEllipsis} size="xl" />
              </button>
              {openMenuId === friend.id && (
                <div className="absolute right-0 top-8 z-50 rounded-xl bg-gray-800 text-white shadow-xl">
                  <button type="button" className="p-3 text-sm" onClick={onRemoveFriend}>Remove Friend</button>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center justify-around">
              <Image className="aspect-square rounded-full border-4 border-blue-500 object-cover shadow-lg shadow-blue-500/30" src={friend.image ?? ''} alt={'friend image'} width={125} height={125} />
              <div className="text-left">
                <p className={`text-sm font-semibold ${liveOnline ? 'text-green-600' : 'text-gray-500'}`}>{liveOnline ? 'Online' : 'Offline'}</p>
                <FontAwesomeIcon className="mt-1 rounded-full border-2 border-gray-100" icon={faCircle} color={liveOnline ? 'limegreen' : 'gray'} size="sm" />
              </div>
            </div>
            <p className="my-2 text-xl font-bold">{friend.name}</p>
            <p className="my-4 w-64 text-lg font-light text-gray-600">{friend.heading}</p>
            <button onClick={() => {
              onSelectFriend(friend, liveOnline)
              onMessage()
            }} className="btn-primary my-4 text-lg">Message <FontAwesomeIcon icon={faPaperPlane} color="white" size="sm" /></button>
          </div>
        )
      })}
    </>
  )
}

type RequestCardsProps = {
  requests: RequestRow[] | undefined;
  loading: boolean;
  onSelectRequest: (request: RequestRow) => void;
  onDeny: () => void;
  onApprove: () => void;
};

const RequestCards = ({ requests, loading, onSelectRequest, onDeny, onApprove }: RequestCardsProps) => {
  if (loading) return <LoadingPage />

  return (
    <>
      {requests?.map((request: RequestRow) => {
        return (
          <div key={request.id} className="surface-dark m-4 flex h-min items-center p-6 text-center">
            <Image className="mx-4 h-min rounded-full border-2 border-yap-gold" src={request.image ?? ''} alt={''} width={75} height={75} />
            <div className="ml-4 flex flex-col">
              <p className="mb-2 text-lg font-semibold">{request.name}</p>
              <div className="flex flex-row justify-around">
                <button onMouseDown={() => onSelectRequest(request)} onMouseUp={onDeny} className="m-2 cursor-pointer rounded-full bg-gray-950 px-4 py-3"><FontAwesomeIcon icon={faX} color="red" size="lg" /></button>
                <button onMouseDown={() => onSelectRequest(request)} onMouseUp={onApprove} className="m-2 cursor-pointer rounded-full bg-gray-950 px-3.5 py-3"><FontAwesomeIcon icon={faCheck} color="green" size="xl" /></button>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { data: session } = useSession();
  const { isUserOnline } = useChatContext();

  const ctx = api.useContext()

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

  const closeMenus = () => {
    setOpenMenuId(null)
  }

  const optionToggle = (event: React.MouseEvent, id: string) => {
    event.stopPropagation()
    setOpenMenuId((current) => (current === id ? null : id))
  }

  const onRemoveFriend = () => {
    if (selectedTab) {
      setOpenMenuId(null)
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

  const approveRequest = () => {
    if (userInfo.id && userInfo.id !== "undefined" && session?.user?.id) {
      approveFriend({ name: userInfo.name, image: userInfo.image, online: userInfo.online, heading: userInfo.heading, id: userInfo.id })
      // Note: We don't call removeRequest here because approving changes the status to ACCEPTED,
      // which automatically removes it from the requests list (getAllRequests only shows PENDING)
    } else {
      toast.error(`Was not able to add ${userInfo.name} as a friend.`)
    }
  }

  const requestTotal = (rows: readonly unknown[] | undefined) => rows?.length ?? 0

  if (!session) return null;

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} userinfo={userInfo} triggermessage={messageTrigger} />
      <div className="flex w-full flex-col items-center justify-center" onClick={closeMenus}>
        <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={selectedTab ? deleteFriend : deleteRequest} item={userInfo.name} theme={selectedTab ? 'bg-white' : 'bg-gray-900'} text={selectedTab ? 'text-black' : 'text-white'} />
        <div className={`no-scrollbar flex h-full w-full flex-col justify-between overflow-y-auto overflow-scroll ${selectedTab ? '' : 'page-canvas-dark'}`} ref={outerDivRef}>
          <div className="flex flex-row">
            <p className={`flex h-16 w-1/2 cursor-pointer items-center justify-center text-center text-2xl font-extrabold ${selectedTab ? 'bg-white/70 text-black' : 'bg-white/10 text-white hover:text-gray-200'}`} onClick={selectedTab ? undefined : handleSelectedTabClick}>Friends<span className="text-md mx-2 font-light">({requestTotal(friendsFromDatabase)})</span></p>
            <p className={`flex h-16 w-1/2 cursor-pointer items-center justify-center text-center text-2xl font-extrabold ${selectedTab ? 'bg-gray-800 text-white hover:text-gray-300' : 'bg-gray-900 text-white'}`} onClick={selectedTab ? handleSelectedTabClick : undefined}>Requests<span className="text-md mx-2 rounded-full bg-red-500 px-3 py-1 font-semibold">{requestTotal(requestFromDatabase)}</span></p>
          </div>
          <div className="flex flex-row flex-grow justify-evenly flex-wrap content-start">
            {selectedTab ? null : <FindUserPage />}
            {selectedTab ? (
              <FriendCards
                friends={friendsFromDatabase}
                loading={loadingFriends}
                openMenuId={openMenuId}
                isUserOnline={isUserOnline}
                onSelectFriend={(friend, online) => currentUserData(
                  friend.name ?? '',
                  friend.image ?? '',
                  online,
                  friend.heading ?? '',
                  friend.id,
                  friend.friendId
                )}
                onToggleMenu={optionToggle}
                onRemoveFriend={onRemoveFriend}
                onMessage={onMessage}
              />
            ) : (
              <RequestCards
                requests={requestFromDatabase}
                loading={loadingRequests}
                onSelectRequest={(request) => currentUserData(
                  request.name ?? '',
                  request.image ?? '',
                  request.online,
                  request.heading ?? '',
                  request.id,
                  request.friendId
                )}
                onDeny={onRequestDeny}
                onApprove={approveRequest}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FriendsPage