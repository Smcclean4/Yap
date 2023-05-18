import { faHeart, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { SetStateAction, useEffect, useState } from 'react'
import { Layout } from '~/components/layout'

const YapsPage = () => {
  interface YapInterface {
    message: string
  }

  const [yaps, setYaps]: Array<any> = useState([])
  const [liked, setLiked] = useState(false);
  const [addFriend, setAddFriend] = useState(false);

  const [personalYap, setPersonalYap] = useState<YapInterface>({
    message: ''
  })

  const onLike = (idx: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setLiked((val, i) => i === idx ? !val : val)
  }

  const onUserAdd = () => {
    setAddFriend(!addFriend)
  }

  const handleYapDisplay = ({ target: input }: any) => {
    setPersonalYap({ ...personalYap, [input.name]: input.value })
  }

  const handleYapSend = () => {
    setYaps([...yaps, personalYap])
    setPersonalYap({ message: '' })
  }

  useEffect(() => {
    console.log(personalYap)
    const messages = yaps?.map((yaps: { message: any }) => yaps.message)
    console.log(messages)
  }, [personalYap])

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        <div className="flex flex-row justify-center h-full w-full flex-wrap overflow-scroll">
          {yaps?.map((allYaps: { message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }, idx: React.Key) => {
            return (
              <div className="h-64 w-96 max-w-5xl bg-gray-800 text-white m-8 flex flex-col rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl" key={idx}>
                <Image className="m-6" src={'/ezgif.com-webp-to-jpg.jpg'} alt={''} height="50" width="50" />
                <p className="text-2xl text-center">{allYaps.message}</p>
                <div className="flex justify-end items-end flex-grow m-4">
                  <FontAwesomeIcon className="m-2 cursor-pointer" icon={faHeart} onClick={(idx) => onLike(idx)} color={liked ? "red" : "white"} size="2x" />
                  <FontAwesomeIcon className="m-2 cursor-pointer" icon={faUserPlus} onClick={onUserAdd} color={addFriend ? "skyblue" : "white"} size="2x" />
                </div>
              </div>
            )
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