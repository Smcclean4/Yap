import React from 'react'
import { Layout } from '~/components/layout'

const YapsPage = () => {

  const handleYapSend = () => {
    alert('sending yap!')
  }

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        <div className="h-full w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-row justify-center">
            <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" placeholder="Enter your message here..." />
            <button className="px-4 py-2  text-white bg-gray-400 hover:bg-gray-500 rounded-tr-full rounded-br-full" type="submit" onClick={handleYapSend}>Send</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YapsPage