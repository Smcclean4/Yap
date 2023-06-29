import { faEllipsis, faHeart, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useModal } from '~/hooks/useModal'
import { Layout } from '~/components/layout'
import { useSession } from 'next-auth/react'
import { DeleteModal } from '~/modals/delete'
import { EditModal } from '~/modals/edit'
import { SidebarNav } from '~/components/sidebar'


const YapsPage = () => {

  interface YapInterface {
    message: string;
    liked: boolean;
    friend: boolean;
    user: string | undefined | null;
    options: boolean;
  }

  interface DeleteInterface {
    deleteUser: string | undefined | null;
    deleteMessage: string;
  }

  const defaultYaps: YapInterface[] = [
    {
      message: 'These are default Yaps.. strength in numbers. 🥰',
      liked: false,
      friend: false,
      user: '',
      options: false
    },
    {
      message: 'These are default Yaps.. strength in numbers. 😋',
      liked: false,
      friend: false,
      user: '',
      options: false
    },
    {
      message: 'These are default Yaps.. strength in numbers. 👑',
      liked: false,
      friend: false,
      user: '',
      options: false
    }
  ]

  const { data: session } = useSession();

  const [yaps, setYaps]: Array<any> = useState([])
  const [yapError, setYapError] = useState('')
  const [updateMessage, setUpdateMessage] = useState('')
  const [trueEditFalseDelete, setTrueEditFalseDelete] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState<DeleteInterface>({ deleteUser: '', deleteMessage: '' })
  const [personalYap, setPersonalYap] = useState<YapInterface>({
    message: '',
    liked: false,
    friend: false,
    user: '',
    options: false
  })

  const { isShowing, toggle } = useModal();

  const onOption = (idx: React.Key) => {
    setYaps((state: { options: boolean }[]) => state?.map((yap: { options: boolean }, i: React.Key) => {
      return i === idx ? { ...yap, options: !yap.options } : yap
    }))
  }

  const onLike = (idx: React.Key) => {
    setYaps((state: { liked: boolean }[]) => state?.map((yap: { liked: boolean }, i: React.Key) => {
      return i === idx ? { ...yap, liked: !yap.liked } : yap
    }))
  }

  const onFriend = (idx: React.Key) => {
    setYaps((state: { friend: boolean }[]) => state?.map((yap: { friend: boolean }, i: React.Key) => {
      return i === idx ? { ...yap, friend: !yap.friend } : yap
    }))
  }

  const setUser = () => {
    if (session) {
      setPersonalYap({ ...personalYap, user: session?.user.email })
    } else {
      setYapError('User is not defined')
    }
  }

  const currentDeleteData = (idx: React.Key) => {
    setDeleteInfo({ deleteUser: yaps[idx].user, deleteMessage: yaps[idx].message })
  }

  const deleteItem = () => {
    setYaps((state: any[]) => state.filter((yap: YapInterface, i: React.Key) => {
      if (yaps[i].user === deleteInfo.deleteUser && yaps[i].message === deleteInfo.deleteMessage) {
        return false
      } else {
        return yap
      }
    }))
    toggle()
  }

  const handleNewMessage = ({ target: input }: any) => {
    setUpdateMessage(input.value)
  }

  const clearUpdateMessage = () => {
    setUpdateMessage('')
  }

  const saveItem = () => {
    setYaps((state: { message: string }[]) => state?.map((yap: { message: string }, i: React.Key) => {
      return yaps[i].user === deleteInfo.deleteUser && yaps[i].message === deleteInfo.deleteMessage ? { ...yap, message: updateMessage } : yap
    }))
    setUpdateMessage('')
    toggle()
  }

  const onEdit = () => {
    setTrueEditFalseDelete(true)
    toggle()
  }

  const onDelete = () => {
    setTrueEditFalseDelete(false)
    toggle()
  }


  const handleYapDisplay = ({ target: input }: any) => {
    setPersonalYap({ ...personalYap, [input.name]: input.value })
  }

  const handleYapSend = () => {
    if (personalYap.message === '') {
      setYapError('Please write a message before sending!')
      return
    }
    setYapError('')
    setYaps([...yaps, personalYap])
    setPersonalYap({ ...personalYap, message: '' })
  }

  useEffect(() => {
    const yapsStorage = JSON.parse(localStorage.getItem('yapsData') || '[]')
    if (yapsStorage) {
      setYaps(yapsStorage)
    }
  }, [])

  useEffect(() => {
    setYaps([...defaultYaps])
  }, [])

  useEffect(() => {
    localStorage.setItem('yapsData', JSON.stringify(yaps))
  }, [yaps])

  return (
    <Layout>
      <SidebarNav user={session?.user.email} />
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        {trueEditFalseDelete ? (
          <EditModal isShowing={isShowing} hide={toggle} saveitem={saveItem} message={deleteInfo.deleteMessage} setnewmessage={handleNewMessage} newmessage={updateMessage} clearmessage={clearUpdateMessage} />
        ) : (
          <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={deleteItem} item={'this Yap'} theme={'bg-white'} text={'text-black'} />
        )}
        <div className="flex flex-row justify-center h-full w-full flex-wrap overflow-scroll no-scrollbar overflow-y-auto content-start">
          {yaps?.map((allYaps: { message: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }, idx: React.Key) => {
            return (
              <div className="h-64 w-96 max-w-5xl bg-gray-800 text-white m-8 flex flex-col rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl" key={idx}>
                <div className="flex flex-row items-center justify-between">
                  <Image className="m-4" src={'/ezgif.com-webp-to-jpg.jpg'} alt={''} height="50" width="50" />
                  {session?.user.email === yaps[idx].user && <FontAwesomeIcon className="m-4 cursor-pointer" onFocus={() => {
                    onOption(idx)
                    currentDeleteData(idx)
                  }} icon={faEllipsis} size="xl" tabIndex={0} onBlur={() => onOption(idx)} />}
                  {yaps[idx].options && session?.user.email ? (
                    <div className="text-center flex flex-col absolute border-2 ml-72 mt-16 w-28 bg-gray-500 border-none text-lg text-white ">
                      <button onMouseDown={onEdit}>Edit</button>
                      <button onMouseDown={onDelete}>Delete</button>
                    </div>
                  ) : ""}
                </div>
                <p className="text-xl text-center">{allYaps.message}</p>
                <div className="flex justify-end items-end flex-grow m-4">
                  <FontAwesomeIcon className="m-2 cursor-pointer" icon={faHeart} onClick={() => onLike(idx)} color={yaps[idx].liked ? "red" : "white"} size="xl" />
                  <FontAwesomeIcon className="m-2 cursor-pointer" icon={faUserPlus} onClick={() => onFriend(idx)} color={yaps[idx].friend ? "skyblue" : "white"} size="xl" />
                </div>
              </div>
            )
          })}
        </div>
        <div className="h-auto w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-col justify-center text-center">
            {yapError && <p className="text-white bg-red-600 w-full max-w-md self-center text-xl p-2 rounded-tl-xl rounded-tr-xl">{yapError}</p>}
            <div className="flex flex-row justify-center">
              <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" name="message" placeholder="Enter your message here..." value={personalYap.message} onFocus={setUser} maxLength={125} onChange={handleYapDisplay} onKeyDown={(e) => e.key === "Enter" && handleYapSend()} />
              <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={handleYapSend}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YapsPage