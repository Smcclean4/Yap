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
import { api } from '~/utils/api'
import { LoadingPage } from '~/shared/loading'
import toast, { Toaster } from 'react-hot-toast'

const YapsPage = () => {

  interface YapInterface {
    message: string;
    likes: string[];
    user: string | undefined | null;
    options: boolean;
  }

  interface DeleteInterface {
    deleteUser: string | undefined | null;
    deleteMessage: string;
  }

  const { data: session } = useSession();

  // const [yaps, setYaps]: Array<any> = useState([])
  const [updateMessage, setUpdateMessage] = useState('')
  const [trueEditFalseDelete, setTrueEditFalseDelete] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState<DeleteInterface>({ deleteUser: '', deleteMessage: '' })
  const [personalYap, setPersonalYap] = useState<YapInterface>({
    message: '',
    likes: [],
    user: '',
    options: false
  })

  const { isShowing, toggle } = useModal();

  const onOption = (idx: React.Key) => {
    // setYaps((state: { options: boolean }[]) => state?.map((yap: { options: boolean }, i: React.Key) => {
    //   return i === idx ? { ...yap, options: !yap.options } : yap
    // }))
  }

  const onLike = (idx: React.Key) => {
    // if (!yaps[idx].likes.includes(session?.user.email)) {
    //   setYaps((state: { likes: boolean }[]) => state?.map((yap: { likes: boolean }, i: React.Key) => {
    //     return i === idx ? { ...yap, likes: [session?.user.email] } : yap
    //   }))
    // } else {
    //   setYaps((state: { likes: boolean }[]) => state?.map((yap: { likes: boolean }, i: React.Key) => {
    //     return i === idx ? { ...yap, likes: [] } : yap
    //   }))
    // }
  }

  const setUser = () => {
    if (session) {
      setPersonalYap({ ...personalYap, user: session?.user.email })
    } else {
      toast.error('User is not defined.')
    }
  }

  const currentDeleteData = (idx: React.Key) => {
    // setDeleteInfo({ deleteUser: yaps[idx].user, deleteMessage: yaps[idx].message })
  }

  const deleteItem = () => {
    // setYaps((state: any[]) => state.filter((yap: YapInterface, i: React.Key) => {
    //   if (yaps[i].user === deleteInfo.deleteUser && yaps[i].message === deleteInfo.deleteMessage) {
    //     return false
    //   } else {
    //     return yap
    //   }
    // }))
    toast.error('Yap deleted!')
    toggle()
  }

  const handleNewMessage = ({ target: input }: any) => {
    setUpdateMessage(input.value)
  }

  const clearUpdateMessage = () => {
    setUpdateMessage('')
  }

  const saveItem = () => {
    if (updateMessage === "") {
      toast.error('Message cannot be empty!')
      return
    }
    // setYaps((state: { message: string }[]) => state?.map((yap: { message: string }, i: React.Key) => {
    //   return yaps[i].user === deleteInfo.deleteUser && yaps[i].message === deleteInfo.deleteMessage ? { ...yap, message: updateMessage } : yap
    // }))
    setUpdateMessage('')
    toast.success('Yap updated!')
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
      toast.error('Please type a message!')
      return
    }
    // setYaps([...yaps, personalYap])
    setPersonalYap({ ...personalYap, message: '' })
  }

  // useEffect(() => {
  //   const yapsStorage = JSON.parse(localStorage.getItem('yapsData') || '[]')
  //   if (yapsStorage) {
  //     setYaps(yapsStorage)
  //   }
  // }, [])


  // useEffect(() => {
  //   localStorage.setItem('yapsData', JSON.stringify(yaps))
  //   console.log(yaps)
  // }, [yaps])

  if (!session) return null

  const AllYaps = () => {
    const { data: yaps, isLoading } = api.yap.getAllYaps.useQuery()
    const { data: uniqueYap } = api.yap.findSpecificYap.useQuery({ text: String(session?.user.email) })

    if (isLoading) return <LoadingPage />

    // console.log(yaps[1].likes[0].user.includes(session?.user.email))

    return (
      <>
        {yaps?.map((allYaps, idx: React.Key) => {
          return (
            <div className="w-full h-fit max-w-xs bg-gray-800 text-white m-8 flex flex-col rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl" key={idx}>
              <div className="flex items-center justify-between">
                <Image className="m-4 rounded-full" src={'/ezgif.com-webp-to-jpg.jpg'} alt={''} height="50" width="50" />
                <div className="flex items-center justify-end pr-2 relative">
                  {session?.user.email === allYaps.user && <FontAwesomeIcon className="m-4 cursor-pointer" onFocus={() => {
                    onOption(idx)
                    currentDeleteData(idx)
                  }} icon={faEllipsis} size="xl" tabIndex={0} onBlur={() => onOption(idx)} />}
                  {allYaps.options && session?.user.email && (
                    <div className="absolute text-center flex flex-col border-2 w-28 bg-gray-500 border-none text-lg text-white ">
                      <button onMouseDown={onEdit}>Edit</button>
                      <button onMouseDown={onDelete}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-left pl-4">{allYaps.message}</p>
              <div className="flex justify-end items-end flex-grow m-4">
                {/* add likes that correspond to session user below */}
                <FontAwesomeIcon className="m-2 cursor-pointer" icon={faHeart} onClick={() => onLike(idx)} color={uniqueYap ? "red" : "white"} size="xl" />
              </div>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} />
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        {trueEditFalseDelete ? (
          <EditModal isShowing={isShowing} hide={toggle} saveitem={saveItem} message={deleteInfo.deleteMessage} setnewmessage={handleNewMessage} newmessage={updateMessage} clearmessage={clearUpdateMessage} />
        ) : (
          <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={deleteItem} item={'this Yap'} theme={'bg-white'} text={'text-black'} />
        )}
        <div className="flex justify-center h-full w-full flex-wrap overflow-scroll no-scrollbar overflow-y-auto content-start">
          <AllYaps />
        </div>
        <div className="h-auto w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-col justify-center text-center">
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