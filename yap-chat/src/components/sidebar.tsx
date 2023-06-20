import React from 'react'
import { LogoutForm } from './logout'
import { ChatMessenger } from './messenger'

export const SidebarNav = ({ user }: any) => {
  return (
    <div className="flex flex-col justify-end text-center w-60 xl:w-1/6 bg-gray-400 p-6">
      <ChatMessenger />
      <LogoutForm />
      <p>Logged in as {user}</p>
    </div>
  )
}
