import React from 'react'
import { signIn } from 'next-auth/react';

export const LoginForm = () => {
  const handleLogin = () => {
    void signIn();
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <button className="btn-primary mx-auto m-3 animate-glow" onClick={handleLogin}>Login</button>
        <p className="animate-pulse text-white/90">New User? Login in to proceed.</p>
      </div>
    </div>
  )
}
