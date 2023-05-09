import React from 'react'
import { signOut } from 'next-auth/react';

export const LogoutForm = () => {

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  }

  return (
    <div>
      <div className="text-white font-extralight">
        <button className="m-3 rounded-full bg-blue-500 mx-auto px-6 py-2" onClick={handleLogout}>Logout</button>
        <p className="animate-pulse">Welcome to Yap.</p>
      </div>
    </div>
  )
}