import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '~/utils/api'
import { LoadingPage } from '~/shared/loading'
import { useModal } from '~/hooks/useModal'
import { RequestModal } from '~/modals/request'
import { RequestFriend } from './sendrequest'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { type RouterOutputs } from '~/utils/api'

type FriendRow = RouterOutputs['friends']['getAllFriends'][number]
type RequestRow = RouterOutputs['friends']['getAllRequests'][number]
type SearchUser = RouterOutputs['user']['searchUsers'][number]

const FindUserPage = () => {

  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('')

  const { isShowing, toggle } = useModal()

  const [requestSent, setRequestSent] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null)

  const { data: userResults, isLoading: loadingSearch, isFetched: fetchedUsers } = api.user.searchUsers.useQuery({ query: searchQuery })
  const { data: getAllFriends } = api.friends.getAllFriends.useQuery()
  const { data: getAllRequests } = api.friends.getAllRequests.useQuery()
  const ctx = api.useContext()

  const { mutate: createFriendRequest } = api.friends.createFriendRequest.useMutation({
    onSuccess: () => {
      toast.success('Friend request sent!')
      setRequestSent(selectedUserName)
      toggle()
      void ctx.friends.getAllRequests.invalidate()
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send friend request')
    }
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const searchIfUserExistsInFriendsDB = (userName: string) => {
    const friendNames =
      getAllFriends?.map((friend: FriendRow) => friend.name).filter((n): n is string => Boolean(n)) ?? []
    return friendNames.includes(userName)
  }

  const searchIfUserHasPendingRequest = (userName: string) => {
    const requestNames =
      getAllRequests?.map((request: RequestRow) => request.name).filter((n): n is string => Boolean(n)) ?? []
    return requestNames.includes(userName)
  }

  const onRequestSend = () => {
    if (selectedUserName) {
      createFriendRequest({ targetUserName: selectedUserName })
    }
  }

  const handleRequestClick = (userName: string) => {
    setSelectedUserName(userName)
    toggle()
  }

  useEffect(() => {
    console.log(searchQuery)
    console.log(userResults)
  }, [searchQuery, userResults])

  return (
    <div className="my-6 flex w-full flex-row items-center justify-center">
      <RequestModal 
        isShowing={isShowing} 
        hide={toggle} 
        user={selectedUserName} 
        sendrequest={onRequestSend} 
      />
      <div className="flex w-4/5 max-w-2xl flex-col items-center justify-center">
        <input onChange={handleSearch} className="field-input mr-2 rounded-full border-2 border-blue-500" type="text" placeholder="Search for a user" />
        <div className="mt-3 w-full overflow-hidden rounded-2xl bg-white/90 shadow-lg">
          {loadingSearch ? (
            <div className="p-2"><LoadingPage /></div>
          ) : searchQuery.length === 0 ? null : (
            userResults?.map((user: SearchUser) => {
              const userName = user.name ?? ''
              const isFriend = searchIfUserExistsInFriendsDB(userName)
              const hasPendingRequest = searchIfUserHasPendingRequest(userName)
              const isRequestSent = requestSent === userName

              return (
                <div key={user.id} className='flex flex-row items-center justify-between border-b border-gray-100 p-3 text-xl last:border-b-0'>
                  <p>{String(session?.user.name) === userName ? null : userName}</p>
                  <div>
                    {fetchedUsers && String(session?.user.name) !== userName ? (
                      isFriend ? (
                        <p className="text-gray-500">Already added</p>
                      ) : hasPendingRequest || isRequestSent ? (
                        <RequestFriend sent={true} text={'Request Sent'} />
                      ) : (
                        <RequestFriend 
                          onAccept={() => handleRequestClick(userName)} 
                        />
                      )
                    ) : ''}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default FindUserPage