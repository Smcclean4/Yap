import React from 'react'
import { signOut } from 'next-auth/react';

export const LogoutForm = () => {

  const handleLogout = () => {
    void signOut({ callbackUrl: '/' });
  }

  return (
    <div>
      <div className="font-extralight text-white">
        <button className="btn-primary mx-auto m-3" onClick={handleLogout}>Logout</button>
        <p className="animate-pulse text-yap-gold">Welcome to Yap.</p>
      </div>
    </div>
  )
}
