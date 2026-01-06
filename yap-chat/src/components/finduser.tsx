import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '~/utils/api'
import { LoadingPage } from '~/shared/loading'
import { useModal } from '~/hooks/useModal'
import { RequestModal } from '~/modals/request'
import { RequestFriend } from './sendrequest'
import toast from 'react-hot-toast'

const FindUserPage = () => {

  const [searchQuery, setSearchQuery] = useState('')

  const { isShowing, toggle } = useModal()

  const [requestSent, setRequestSent] = useState<string | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null)

  const { data: userResults, isLoading: loadingSearch, isFetched: fetchedUsers } = api.user.searchUsers.useQuery({ query: searchQuery })
  const { data: getAllFriends } = api.friends.getAllFriends.useQuery()
  const { data: getAllRequests } = api.friends.getAllRequests.useQuery()
  const ctx = api.useContext()

  const { mutate: createFriendRequest, isLoading: isSendingRequest } = api.friends.createFriendRequest.useMutation({
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
    const friendNames = getAllFriends?.map((friend: any) => friend.name).filter(Boolean) || []
    return friendNames.includes(userName)
  }

  const searchIfUserHasPendingRequest = (userName: string) => {
    // Check if there's a pending request where this user sent a request to the current user
    const requestNames = getAllRequests?.map((request: any) => request.name).filter(Boolean) || []
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
  }, [searchQuery])

  return (
    <div className="flex flex-row items-center justify-center w-full my-4">
      <RequestModal 
        isShowing={isShowing} 
        hide={toggle} 
        user={selectedUserName} 
        sendrequest={onRequestSend} 
      />
      <div className="flex flex-col items-center w-3/5 justify-center">
        <input onChange={handleSearch} className="p-2 rounded-full border-2 border-blue-500 w-full mr-2" type="text" placeholder="Search for a user" />
        <div className="w-full bg-white">
          {loadingSearch ? (
            <div className="p-2"><LoadingPage /></div>
          ) : searchQuery.length === 0 ? null : (
            userResults?.map((user: any) => {
              const userName = user.name
              const isFriend = searchIfUserExistsInFriendsDB(userName)
              const hasPendingRequest = searchIfUserHasPendingRequest(userName)
              const isRequestSent = requestSent === userName

              return (
                <div key={user.id} className='flex flex-row justify-between items-center text-xl p-2'>
                  <p>{userName}</p>
                  <div>
                    {fetchedUsers ? (
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