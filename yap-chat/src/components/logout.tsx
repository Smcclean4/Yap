import React from 'react'
import { signOut } from 'next-auth/react';

export const LogoutForm = () => {

  const handleLogout = (event: { preventDefault: () => void; }) => {
    event?.preventDefault();
    signOut({ callbackUrl: '/' });
  }

  return (
    <div>
      <div className="flex flex-col">
        <button className="m-3 rounded-full bg-blue-500 mx-auto px-6 py-2" type="submit" onClick={handleLogout}>Logout</button>
        <p className="animate-pulse">Welcome to Yap.</p>
      </div>
    </div>
  )
}