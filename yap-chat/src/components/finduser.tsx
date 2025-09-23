import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '~/utils/api'
import { LoadingPage } from '~/shared/loading'
import { useModal } from '~/hooks/useModal'
import { RequestModal } from '~/modals/request'
import { RequestFriend } from './sendrequest'

const FindUserPage = () => {

  const [searchQuery, setSearchQuery] = useState('')

  const { isShowing, toggle } = useModal()

  const { data: userResults, isLoading: loadingSearch, isFetched: fetchedUsers } = api.user.searchUsers.useQuery({ query: searchQuery })
  const { data: getAllFriends } = api.friends.getAllFriends.useQuery()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const searchIfUserExistsInFriendsDB = (user: any) => {
    return getAllFriends?.map((friends: any) => friends.name).includes(user)
  }

  const onRequestSend = () => {
    toggle()
  }

  useEffect(() => {
    console.log(searchQuery)
    console.log(userResults)
  }, [searchQuery])

  return (
    <div className="flex flex-row items-center justify-center w-full my-4">
      {/* find specific user and display that name in modal.. right now im sure it displays all names since its getting all user results */}
      <RequestModal isShowing={isShowing} hide={toggle} user={userResults?.map((user: any) => user.name)} sendrequest={onRequestSend} />
      <div className="flex flex-col items-center w-3/5 justify-center">
        <input onChange={handleSearch} className="p-2 rounded-full border-2 border-blue-500 w-full mr-2" type="text" placeholder="Search for a user" />
        <div className="w-full bg-white">
          {loadingSearch ? <div className="p-2"><LoadingPage /></div> : searchQuery.length === 0 ? null : userResults?.map((user: any) => <div key={user.id} className='flex flex-row justify-between items-center text-xl p-2'><p>{user.name}</p><p>{fetchedUsers ? searchIfUserExistsInFriendsDB(user.name) ? 'Already added' : <RequestFriend onAccept={onRequestSend} /> : ''}</p></div>)}
        </div>
      </div>
    </div>
  )
}

export default FindUserPage