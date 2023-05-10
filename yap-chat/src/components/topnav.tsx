import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faComment, faHouse, faPerson, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false;

export const TopNav = () => {
  return (
    <div className="flex justify-between flex-row flex-grow bg-blue-500 w-full text-white absolute">
      <p className="text-7xl m-2 p-4">Yap.</p>
      <ul className="flex flex-row items-center">
        <div className="flex flex-col cursor-pointer text-center">
          <Link href="/home">
            <FontAwesomeIcon icon={faHouse} size="2x" />
            <li className="mx-8 text-xl underline underline-offset-4">Home</li>
          </Link>
        </div>
        <div className="flex flex-col cursor-pointer text-center">
          <Link href="/yaps">
            <FontAwesomeIcon icon={faComment} size="2x" />
            <li className="mx-8 text-xl underline underline-offset-4">Yaps</li>
          </Link>
        </div>
        <div className="flex flex-col cursor-pointer text-center">
          <Link href="/friends">
            <FontAwesomeIcon icon={faUserFriends} size="2x" />
            <li className="mx-8 text-xl underline underline-offset-4">Friends</li>
          </Link>
        </div>
        <div className="flex flex-col cursor-pointer text-center">
          <Link href="/profile">
            <FontAwesomeIcon icon={faPerson} size="2x" />
            <li className="mx-8 text-xl underline underline-offset-4">Profile</li>
          </Link>
        </div>
      </ul>
    </div>
  )
}
