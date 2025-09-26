import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

interface RequestFriendProps {
  onAccept?: () => void;
  sent?: boolean;
  text?: string;
}

export const RequestFriend = ({ onAccept, sent, text }: RequestFriendProps) => {
  return (
    <div>
      {text && <span className={`m-2 ${sent ? 'text-gray-500' : ''}`}>{text}</span>}
      <button className={`${sent ? 'bg-gray-500 hover:cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-full  ${sent ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onAccept} disabled={sent}><FontAwesomeIcon icon={sent ? faCheck : faUserPlus} /></button>
    </div>
  )
}