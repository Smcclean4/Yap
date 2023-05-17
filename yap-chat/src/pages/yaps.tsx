import React, { useEffect, useState } from 'react'
import { Layout } from '~/components/layout'

const YapsPage = () => {
  interface YapInterface {
    message: string
  }

  const [yaps, setYaps]: Array<any> = useState([])

  const [personalYap, setPersonalYap] = useState<YapInterface>({
    message: ''
  })

  const handleYapDisplay = ({ target: input }: any) => {
    setPersonalYap({ ...personalYap, [input.name]: input.value })
  }

  const handleYapSend = () => {
    setYaps([...yaps, personalYap])
    setPersonalYap({ message: '' })
  }

  useEffect(() => {
    console.log(personalYap)
    console.log(yaps)
  }, [personalYap])

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        <div className="flex flex-row justify-center items-center h-full w-full border-2 border-black">
          <p>Cash</p>
          {yaps?.map((allYaps: { message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }, idx: React.Key) => {
            <div className="h-64 w-48 bg-blue-500" key={idx}>
              <h1>money</h1>
              {allYaps.message}
            </div>
          })}
        </div>
        <div className="h-auto w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-row justify-center">
            <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" name="message" placeholder="Enter your message here..." value={personalYap.message} onChange={handleYapDisplay} />
            <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={handleYapSend}>Send</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YapsPage