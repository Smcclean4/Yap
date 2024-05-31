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
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import toast, { Toaster } from 'react-hot-toast'
import { unique } from 'next/dist/build/utils'

dayjs.extend(relativeTime)

const YapsPage = () => {

  interface YapInterface {
    likes: string[];
    user: string | undefined | null;
    options: boolean;
    message: string;
  }

  interface DeleteInterface {
    deleteUser: string | undefined | null;
    deleteMessage: string;
  }

  const { data: session } = useSession();

  const [yap, setYaps]: Array<any> = useState([])
  const [updateMessage, setUpdateMessage] = useState('')
  const [trueEditFalseDelete, setTrueEditFalseDelete] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState<DeleteInterface>({ deleteUser: '', deleteMessage: '' })
  // option state for each yap.. for each yap create an option boolean and when the option toggle
  // is clicked at the idx of the yap change that option toggle to true so that the modal is triggered.
  const [options, setOptions] = useState<boolean[]>([])
  const [personalYap, setPersonalYap] = useState<YapInterface>({
    likes: [],
    user: '',
    options: false,
    message: ''
  })

  const { isShowing, toggle } = useModal();

  // figure out option on and off instead of doing it in database
  // const onOption = (idx: React.Key) => {
  //   setYaps((state: { options: boolean }[]) => state?.map((yap: { options: boolean }, i: React.Key) => {
  //     return i === idx ? { ...yap, options: !yap.options } : yap
  //   }))
  // }

  const optionToggle = (idx: React.Key) => {
    // create an option function that takes in an id and then toggle option modal at that specific yap.
  }

  const setUser = () => {
    if (session) {
      setPersonalYap({ ...personalYap, user: session?.user.email })
    } else {
      toast.error('User is not defined.')
    }
  }

  const currentDeleteData = (idx: React.Key) => {
    // setDeleteInfo({ deleteUser: yap[idx].user, deleteMessage: yap[idx].message })
  }

  const deleteItem = () => {
    // setYaps((state: any[]) => state.filter((yap: YapInterface, i: React.Key) => {
    //   if (yap[i].user === deleteInfo.deleteUser && yap[i].message === deleteInfo.deleteMessage) {
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
    //   return yap[i].user === deleteInfo.deleteUser && yap[i].message === deleteInfo.deleteMessage ? { ...yap, message: updateMessage } : yap
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

  // handle all yapsFromDatabase display and current user likes
  const { data: yapsFromDatabase, isLoading: loadingYaps } = api.yap.getAllYaps.useQuery()

  // sets users message and adds it to post
  const [userMessage, setUserMessage] = useState('')
  // gets all context for full refresh
  const ctx = api.useContext()
  // creates a user post
  const { mutate: userYap, isLoading: isPosting } = api.yap.postYap.useMutation({
    onSettled: () => {
      setPersonalYap({ ...personalYap, message: userMessage })
      setUserMessage("");
      void ctx.yap.getAllYaps.invalidate();
    }
  })

  const handleAllYapSend = async () => {
    if (userMessage === '') {
      toast.error('Please type a message!')
      return
    }
    userYap({ message: userMessage, user: String(session?.user.email) })

  }

  useEffect(() => {
    // not exactly for each to store true and false data .. but definitely in this direction. 
    yapsFromDatabase?.forEach(val => {
      setOptions([...options, false])
    })
    console.log(options)
  }, [])

  useEffect(() => {
    console.log(yapsFromDatabase)
  }, [yapsFromDatabase])

  const { mutate: likeYap } = api.yap.likeYap.useMutation()

  if (!session) return null

  const DisplayAllYaps = () => {

    const { data: uniqueYaps } = api.yap.findSpecificUserLikes.useQuery({ text: String(session?.user.email) })

    if (loadingYaps) return <LoadingPage />

    return (
      <>
        {yapsFromDatabase?.map((allYaps: any, idx: number) => {
          return (
            // fidling with focus on outer div.. shows promimse
            <div className="w-full h-fit max-w-xs bg-gray-800 text-white m-8 flex flex-col rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl" key={idx}>
              <div className="flex items-center justify-between">
                <Image className="m-4 rounded-full" src={'/ezgif.com-webp-to-jpg.jpg'} alt={''} height="50" width="50" />
                <p className="text-md md:text-lg font-extralight italic text-gray-300"><span className="font-extralight">{` • ${dayjs(allYaps.createdAt).fromNow()}`}</span></p>
                <div className="flex items-center justify-end pr-2 relative" onBlur={() => optionToggle(idx)} tabIndex={0}>
                  {session?.user.email === allYaps.user && <FontAwesomeIcon className="m-4 cursor-pointer" icon={faEllipsis} size="xl" onFocus={() =>
                    // prevent default?
                    // optionToggle({ id: allYaps.id })
                    optionToggle(idx)
                  } tabIndex={0} />}
                  {yap.options && session?.user.email && (
                    <div className="absolute text-center flex flex-col border-2 w-28 bg-gray-500 border-none text-lg text-white">
                      <button onMouseDown={onEdit}>Edit</button>
                      <button onMouseDown={onDelete}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-left pl-4">{allYaps.message}</p>
              <div className="flex justify-end items-end flex-grow m-4">
                <FontAwesomeIcon className="m-2 cursor-pointer" icon={faHeart} onClick={() => likeYap({ user: String(session?.user.email), id: allYaps.id })} color={uniqueYaps?.map(val => val.id).includes(allYaps.id) ? "red" : "white"} size="xl" />
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
          <DisplayAllYaps />
        </div>
        <div className="h-auto w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-col justify-center text-center">
            <div className="flex flex-row justify-center">
              <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" name="message" placeholder="Enter your message here..." value={userMessage} onFocus={setUser} disabled={isPosting} maxLength={125} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" &&
                handleAllYapSend()} />
              <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={() => handleAllYapSend()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YapsPage