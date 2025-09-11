import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

export const RequestFriend = () => {
  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"><FontAwesomeIcon icon={faUserPlus} /></button>
      <button className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 ml-2"><FontAwesomeIcon icon={faXmark} /></button>
    </div>
  )
}