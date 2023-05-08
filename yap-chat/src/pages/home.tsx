import React from 'react'
import { useSession } from 'next-auth/react'
import { LogoutForm } from '~/components/logout';

const HomePage = () => {
  const { data: session }: any = useSession();

  return (
    <div className="flex flex-col justify-center items-center text-center">
      <LogoutForm />
      <p>Logged in as {session.user.email}</p>
    </div>
  )
}

export default HomePage