import React from 'react'
import { signIn } from 'next-auth/react';

export const LoginForm = () => {
  const handleLogin = () => {
    signIn()
  }

  return (
    <div>
      <div className="flex flex-col">
        <button className="m-3 rounded-full bg-blue-500 mx-auto px-6 py-2" onClick={handleLogin}>Login</button>
        <p className="animate-pulse">New User? Login in to proceed.</p>
      </div>
    </div>
  )
}
