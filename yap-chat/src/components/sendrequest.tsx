import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

interface RequestFriendProps {
  onAccept: () => void;
}

export const RequestFriend = ({ onAccept }: RequestFriendProps) => {
  return (
    <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600" onClick={onAccept}><FontAwesomeIcon icon={faUserPlus} /></button>
    </div>
  )
}