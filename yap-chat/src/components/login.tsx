import React from 'react'

export const LoginForm = () => {

  const handleLogin = (event: { preventDefault: () => void; }) => {
    event?.preventDefault();
    console.log('logging in!')
  }

  return (
    <div>
      <form action="post" onSubmit={handleLogin}>
        <div className="flex flex-col">
          <p className="text-left pl-2">Email</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Email" type="text"></input>
          <p className="text-left pl-2">Password</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Password" type="password"></input>
          <button className="m-3 p-1 rounded-full bg-blue-500 w-1/2 mx-auto">Login</button>
        </div>
      </form>
    </div>
  )
}
