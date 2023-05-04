import React from 'react'

export const RegisterForm = () => {

  const handleRegister = (event: { preventDefault: () => void; }) => {
    event?.preventDefault();
    console.log('logging in!')
  }

  return (
    <div>
      <form action="post" onSubmit={handleRegister}>
        <div className="flex flex-col">
          <p className="text-left pl-2">Name</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Name" type="text"></input>
          <p className="text-left pl-2">Username</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Username" type="text"></input>
          <p className="text-left pl-2">Email</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Email" type="email"></input>
          <p className="text-left pl-2">Password</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Password" type="password"></input>
          <p className="text-left pl-2">Confirm Password</p>
          <input className="m-2 w-64 p-1 text-black" placeholder="Confirm Password" type="password"></input>
          <button className="m-3 p-1 rounded-full bg-blue-500 w-1/2 mx-auto">Register</button>
        </div>
      </form>
    </div>
  )
}
