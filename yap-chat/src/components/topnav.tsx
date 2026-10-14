import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { faComment, faHouse, faPerson, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false;

const navItems = [
  { href: '/home', label: 'Home', icon: faHouse, enter: 'animate-extension1' },
  { href: '/yaps', label: 'Yaps', icon: faComment, enter: 'animate-extension2' },
  { href: '/friends', label: 'Friends', icon: faUserFriends, enter: 'animate-extension3' },
  { href: '/profile', label: 'Profile', icon: faPerson, enter: 'animate-extension4' },
] as const

export const TopNav = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const openNav = () => {
    setOpen(!open)
  }

  const isActive = (href: string) => router.pathname === href

  return (
    <>
      <div className="z-50 flex w-full flex-row items-center justify-between bg-blue-500 px-6 py-4 shadow-lg shadow-blue-500/30">
        <Link href="/" className="flex items-center gap-3">
          <img src="https://img.icons8.com/64/FFAE42/globe" alt="Yap chat" className="h-10 w-10 drop-shadow" />
          <span className="hidden text-3xl font-extrabold tracking-tight text-white sm:inline">Yap.</span>
        </Link>
        <div className="flex cursor-pointer flex-row sm:hidden">
          <div className="absolute right-5 top-8 z-20 flex h-auto w-auto flex-col items-center pr-2 text-center">
            <ul className="z-20" onClick={openNav}>
              <li className={open ? 'animate-rotateUp my-2 w-10 border-2 text-2xl' : 'animate-rotateUpRev my-2 w-10 border-2 text-2xl'}></li>
              <li className={open ? 'animate-fading my-2 w-10 border-2 text-2xl' : "animate-fadingRev my-2 w-10 border-2 text-2xl"}></li>
              <li className={open ? 'animate-rotateDwn my-2 w-10 border-2 text-2xl' : 'animate-rotateDwnRev my-2 w-10 border-2 text-2xl'}></li>
            </ul>
            <ul className={open ? "animate-fadingRev rounded-2xl bg-white/90 px-4 py-2 text-black shadow-xl backdrop-blur-3xl" : "animate-fading text-black backdrop-blur-3xl"}>
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className={`${open ? item.enter : ''} my-3 mx-2 p-2 text-xl ${isActive(item.href) ? 'font-extrabold text-blue-500' : ''}`}
                >
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hidden sm:block">
          <ul className="flex text-center text-white">
            {navItems.map((item) => (
              <li key={item.href} className={isActive(item.href) ? 'nav-link nav-link-active' : 'nav-link'}>
                <Link href={item.href} className="flex flex-col items-center">
                  <FontAwesomeIcon icon={item.icon} size="xl" />
                  <p className="mt-1 text-sm font-semibold">{item.label}</p>
                  <span className={`mt-1 h-1 w-8 rounded-full ${isActive(item.href) ? 'bg-yap-gold' : 'bg-transparent'}`} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
