import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faComment, faHouse, faPerson, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import Image from 'next/image'
config.autoAddCss = false;

export const TopNav = () => {
  const [open, setOpen] = useState(false);

  const openNav = () => {
    setOpen(!open)
  }
  return (
    <>
      <div className="p-8 flex flex-row items-center justify-between w-full bg-blue-500 absolute">
        <Link href="/"><p className="text-white text-6xl">Yap.</p></Link>
        <div className="flex flex-row cursor-pointer sm:hidden z-10">
          <div className="w-auto h-auto absolute flex flex-col items-center right-5 top-10 text-center pr-2">
            <ul onClick={openNav}>
              <li className={open ? 'animate-rotateUp text-white text-2xl border-2 my-2 w-10' : 'animate-rotateUpRev text-white text-2xl border-2 my-2 w-10'}></li>
              <li className={open ? 'animate-fading text-white text-2xl border-2 my-2 w-10' : "animate-fadingRev text-white text-2xl border-2 my-2 w-10"}></li>
              <li className={open ? 'animate-rotateDwn text-white text-2xl border-2 my-2 w-10' : 'animate-rotateDwnRev text-white text-2xl border-2 my-2 w-10'}></li>
            </ul>
            <ul className={open ? "animate-fadingRev backdrop-blur-sm text-white" : "animate-fading backdrop-blur-sm text-white"}>
              <li className={open ? "animate-extension1 my-3 p-2 mx-2 text-xl" : "my-3 p-2 mx-2 text-xl"}>
                <Link href="/home">Home</Link>
              </li>
              <li className={open ? "animate-extension2 my-3 p-2 mx-2 text-xl" : "my-3 p-2 mx-2 text-xl"}>
                <Link href="/yaps">Yaps</Link>
              </li>
              <li className={open ? "animate-extension3 mb-10 p-2 mx-2 text-xl" : "mb-10 p-2 mx-2 text-xl"}>
                <Link href="/friends">Friends</Link>
              </li>
              <li className={open ? "animate-extension3 mb-10 p-2 mx-2 text-xl" : "mb-10 p-2 mx-2 text-xl"}>
                <Link href="/profile">Profile</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden sm:block">
          <ul className="flex text-white text-center">
            <li className="mx-10 underline underline-offset-8">
              <Link href="/home"><FontAwesomeIcon icon={faHouse} size="xl" /></Link>
              <p>Home</p>
            </li>
            <li className="mx-10 underline underline-offset-8">
              <Link href="/yaps"><FontAwesomeIcon icon={faComment} size="xl" /></Link>
              <p>Yaps</p>
            </li>
            <li className="mx-10 underline underline-offset-8">
              <Link href="/friends"><FontAwesomeIcon icon={faUserFriends} size="xl" /></Link>
              <p>Friends</p>
            </li>
            <li className="mx-10 underline underline-offset-8">
              <Link href="/profile"><FontAwesomeIcon icon={faPerson} size="xl" /></Link>
              <p>Profile</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

// import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import Link from 'next/link'
// import { faComment, faHouse, faPerson, faUserFriends } from '@fortawesome/free-solid-svg-icons'
// import '@fortawesome/fontawesome-svg-core/styles.css'
// import { config } from '@fortawesome/fontawesome-svg-core'
// config.autoAddCss = false;

// export const TopNav = () => {
//   return (
//     <div className="flex justify-between flex-row flex-grow bg-blue-500 w-full text-white absolute">
//       <p className="text-7xl m-2 p-4">Yap.</p>
//       <ul className="flex flex-row items-center">
//         <div className="flex flex-col cursor-pointer text-center">
//           <Link href="/home">
//             <FontAwesomeIcon icon={faHouse} size="xl" />
//             <li className="mx-8 text-xl underline underline-offset-4">Home</li>
//           </Link>
//         </div>
//         <div className="flex flex-col cursor-pointer text-center">
//           <Link href="/yaps">
//             <FontAwesomeIcon icon={faComment} size="xl" />
//             <li className="mx-8 text-xl underline underline-offset-4">Yaps</li>
//           </Link>
//         </div>
//         <div className="flex flex-col cursor-pointer text-center">
//           <Link href="/friends">
//             <FontAwesomeIcon icon={faUserFriends} size="xl" />
//             <li className="mx-8 text-xl underline underline-offset-4">Friends</li>
//           </Link>
//         </div>
//         <div className="flex flex-col cursor-pointer text-center">
//           <Link href="/profile">
//             <FontAwesomeIcon icon={faPerson} size="xl" />
//             <li className="mx-8 text-xl underline underline-offset-4">Profile</li>
//           </Link>
//         </div>
//       </ul>
//     </div>
//   )
// }
