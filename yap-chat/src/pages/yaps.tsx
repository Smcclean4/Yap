import { faHeart, faTrashCan, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useModal } from '~/hooks/useModal'
import { Layout } from '~/components/layout'
import { useSession } from 'next-auth/react'

const YapsPage = () => {
  interface YapInterface {
    message: string;
    liked: boolean;
    friend: boolean;
    user: string | undefined | null;
  }

  const [yaps, setYaps]: Array<any> = useState([])

  const { data: session } = useSession();

  const [personalYap, setPersonalYap] = useState<YapInterface>({
    message: '',
    liked: false,
    friend: false,
    user: ''
  })

  const { isShowing, toggle } = useModal();

  const onLike = (idx: React.Key) => {
    setYaps((state: any) => state?.map((yap: YapInterface, i: any) => {
      return i === idx ? { ...yap, liked: true } : yap
    }))
  }

  const onUnlike = (idx: React.Key) => {
    setYaps((state: any) => state?.map((yap: YapInterface, i: any) => {
      return i === idx ? { ...yap, liked: false } : yap
    }))
  }

  const onAddFriend = (idx: React.Key) => {
    setYaps((state: any) => state?.map((yap: YapInterface, i: any) => {
      return i === idx ? { ...yap, friend: true } : yap
    }))
  }

  const onRemoveFriend = (idx: React.Key) => {
    setYaps((state: any) => state?.map((yap: YapInterface, i: any) => {
      return i === idx ? { ...yap, friend: false } : yap
    }))
  }

  const handleYapDisplay = ({ target: input }: any) => {
    setPersonalYap({ ...personalYap, [input.name]: input.value })
  }

  const handleYapSend = () => {
    setYaps([...yaps, personalYap])
    setPersonalYap({ ...personalYap, message: '' })
  }

  useEffect(() => {
    const yapsStorage = JSON.parse(localStorage.getItem('yapsData') || '[]')
    if (yapsStorage) {
      setYaps(yapsStorage)
    }
    setPersonalYap({ ...personalYap, user: session?.user.email })
  }, [])

  useEffect(() => {
    localStorage.setItem('yapsData', JSON.stringify(yaps))
    console.log(yaps)
  }, [yaps])

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        <div className="flex flex-row justify-center h-full w-full flex-wrap overflow-scroll">
          {yaps?.map((allYaps: { message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }, idx: React.Key) => {
            return (
              <div className="h-64 w-96 max-w-5xl bg-gray-800 text-white m-8 flex flex-col rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl" key={idx}>
                <div className="flex flex-row items-center justify-between">
                  <Image className="m-4" src={'/ezgif.com-webp-to-jpg.jpg'} alt={''} height="50" width="50" />
                  {session?.user.email === yaps[idx].user && <FontAwesomeIcon className="m-4 cursor-pointer" icon={faTrashCan} size="2xl" />}
                </div>
                <p className="text-xl text-center">{allYaps.message}</p>
                <div className="flex justify-end items-end flex-grow m-4">
                  <FontAwesomeIcon className="m-2 cursor-pointer" icon={faHeart} onClick={() => yaps[idx].liked ? onUnlike(idx) : onLike(idx)} color={yaps[idx].liked ? "red" : "white"} size="2x" />
                  <FontAwesomeIcon className="m-2 cursor-pointer" icon={faUserPlus} onClick={() => yaps[idx].friend ? onRemoveFriend(idx) : onAddFriend(idx)} color={yaps[idx].friend ? "skyblue" : "white"} size="2x" />
                </div>
              </div>
            )
          })}
        </div>
        <div className="h-auto w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-row justify-center">
            <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" name="message" placeholder="Enter your message here..." value={personalYap.message} maxLength={125} onChange={handleYapDisplay} onKeyDown={(e) => e.key === "Enter" && handleYapSend()} />
            <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={handleYapSend}>Send</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YapsPage