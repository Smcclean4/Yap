import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '~/utils/api'

const FindUserPage = () => {

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const { data: userResults, isLoading: loadingSearch } = api.user.searchUsers.useQuery({ query: searchQuery})

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    console.log(searchQuery)
    console.log(userResults)
  }, [searchQuery])

  return (
    <div className="flex flex-row items-center justify-center w-full my-4">
        <div className="flex flex-col items-center w-3/5 justify-center">
        <input onChange={handleSearch} className="p-2 rounded-full border-2 border-blue-500 w-full mr-2" type="text" placeholder="Search for a user" />
        <div className="w-full bg-white">
          {searchQuery.length === 0 ? null : userResults?.map((user: any) => <p className="hover:bg-gray-200 hover:cursor-pointer text-xl p-2" key={user.id}>{user.name}</p>)}
        </div>
        </div>
    </div>
  )
}

export default FindUserPage