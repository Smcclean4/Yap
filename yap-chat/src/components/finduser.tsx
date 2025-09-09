import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '~/utils/api'
import { LoadingPage } from '~/shared/loading'
import { useModal } from '~/hooks/useModal'
import { RequestModal } from '~/modals/request'
import { RequestFriend } from './request'

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
    alert('Sending a request!')
    toggle()
  }

  useEffect(() => {
    console.log(searchQuery)
    console.log(userResults)
  }, [searchQuery])

  return (
    <div className="flex flex-row items-center justify-center w-full my-4">
      <RequestModal isShowing={isShowing} hide={toggle} item={'random user'} sendrequest={onRequestSend} />
      <div className="flex flex-col items-center w-3/5 justify-center">
        <input onChange={handleSearch} className="p-2 rounded-full border-2 border-blue-500 w-full mr-2" type="text" placeholder="Search for a user" />
        <div className="w-full bg-white">
          {loadingSearch ? <div className="p-2"><LoadingPage /></div> : searchQuery.length === 0 ? null : userResults?.map((user: any) => <div className={`flex flex-row justify-between items-center ${searchIfUserExistsInFriendsDB(user.name) ? '' : 'hover:bg-gray-200 hover:cursor-pointer'} text-xl p-2`} onClick={() => { searchIfUserExistsInFriendsDB(user.name) ? null : toggle() }}><p key={user.id}>{user.name}</p><p>{fetchedUsers ? searchIfUserExistsInFriendsDB(user.name) ? 'Already added' : <RequestFriend /> : ''}</p></div>)}
        </div>
      </div>
    </div>
  )
}

export default FindUserPage