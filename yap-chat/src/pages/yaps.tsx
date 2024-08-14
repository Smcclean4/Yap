import { faEllipsis, faHeart, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
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
import { Yap, Like } from '@prisma/client'

dayjs.extend(relativeTime)

const YapsPage = () => {

  interface YapInterface {
    likes: string[];
    user: string | undefined | null;
    options: boolean;
    message: string;
  }

  interface DeleteInterface {
    deleteMessage: any;
    deleteId: string;
  }

  const { data: session } = useSession();

  const [updateMessage, setUpdateMessage] = useState('')
  const [trueEditFalseDelete, setTrueEditFalseDelete] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState<DeleteInterface>({ deleteMessage: '', deleteId: '' })
  const [options, setOptions] = useState<boolean[]>([])

  const { isShowing, toggle } = useModal();
  const optionsRef = useRef<HTMLDivElement>(null)
  const outerDivRef = useRef<HTMLDivElement>(null)

  const outerDivToggle = (element: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (optionsRef.current && !optionsRef.current.contains(element.target as Node)) {
      setOptions((boolArray) => boolArray.map((options, i) => {
        return options ? false : false
      }))
    }
  }

  const optionToggle = (element: React.MouseEvent<HTMLDivElement, MouseEvent>, idx?: React.Key) => {
    if (optionsRef.current && !optionsRef.current.contains(element.target as Node)) {
      setOptions((boolArray) => boolArray.map((options, i) => {
        return i === idx ? false : options
      }))
    } else {
      setOptions((boolArray) => boolArray.map((options, i) => {
        return i === idx ? true : options
      }))
    }
  }

  const addOption = () => {
    setOptions([...options, false])
  }

  const currentDeleteData = (id: string, message?: string) => {
    setDeleteInfo({ deleteId: id, deleteMessage: message })
  }

  const handleNewMessage = ({ target: input }: any) => {
    setUpdateMessage(input.value)
  }

  const clearUpdateMessage = () => {
    setUpdateMessage('')
  }

  const { mutate: editYap } = api.yap.editYap.useMutation({
    onSettled: () => {
      void ctx.yap.getAllYaps.invalidate();
    }
  });

  const editItem = () => {
    if (updateMessage === "") {
      toast.error('Message cannot be empty!')
      return
    }
    if (updateMessage) {
      editYap({ id: deleteInfo.deleteId, message: updateMessage })
      toast.success('Yap updated!')
      setUpdateMessage('')
      toggle()
      return
    }
    toast.error('Yap was not able to be updated!')
    setUpdateMessage('')
    toggle()
  }

  const { mutate: deleteYap } = api.yap.deleteYap.useMutation({
    onSettled: () => {
      void ctx.yap.getAllYaps.invalidate();
    }
  })

  const deleteItem = () => {
    deleteYap({ id: deleteInfo.deleteId })
    toast.error('Yap deleted!')
    toggle()
  }

  const onEdit = (idDatabase: string, messageFromDatabase: string) => {
    setTrueEditFalseDelete(true)
    currentDeleteData(idDatabase, messageFromDatabase)
    toggle()
  }

  const onDelete = (idDatabase: string) => {
    setTrueEditFalseDelete(false)
    currentDeleteData(idDatabase)
    toggle()
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
    addOption()
  }

  useEffect(() => {
    const optionsFromLocalStorage = JSON.parse(localStorage.getItem("options") || "[]");
    if (options.length === 0) {
      setOptions(optionsFromLocalStorage)
    } else if (optionsFromLocalStorage.length === 0) {
      yapsFromDatabase?.forEach(() => {
        setOptions([...options, false])
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  const { mutate: likeYap } = api.yap.likeYap.useMutation()

  if (!session) return null

  const DisplayAllYaps = () => {

    const { data: uniqueYaps } = api.yap.findSpecificUserLikes.useQuery({ text: String(session?.user.email) })

    if (loadingYaps) return <LoadingPage />

    return (
      <>
        {yapsFromDatabase?.map((allYaps: any, idx: any) => {
          return (
            <div className="w-full h-fit max-w-xs bg-gray-800 text-white m-8 flex flex-col rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl" key={idx}>
              <div className="flex items-center justify-between">
                <Image className="m-4 rounded-full" src={'/ezgif.com-webp-to-jpg.jpg'} alt={''} height="50" width="50" />
                <p className="text-md md:text-lg font-extralight italic text-gray-300"><span className="font-extralight">{` • ${dayjs(allYaps.createdAt).fromNow()}`}</span></p>
                <div className="flex items-center justify-end pr-2 relative" onClick={(element) => optionToggle(element, idx)}>
                  {session?.user.email === allYaps.user && <FontAwesomeIcon className="m-4 cursor-pointer" icon={faEllipsis} size="xl" />}
                  {options[idx] && session?.user.email && (
                    <div className="absolute text-center flex flex-col border-2 w-28 bg-gray-500 border-none text-lg text-white" ref={optionsRef}>
                      <button onMouseDown={() => onEdit(allYaps.id, allYaps.message)}>Edit</button>
                      <button onMouseDown={() => onDelete(allYaps.id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-left pl-4">{allYaps.message}</p>
              <div className="flex justify-end items-end flex-grow m-4">
                {/* find some way to make mirror of likes on backend? based off of ID. similar to options tab. then in color go based off of that */}
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
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200" onClick={(element) => outerDivToggle(element)}>
        {trueEditFalseDelete ? (
          <EditModal isShowing={isShowing} hide={toggle} saveitem={editItem} message={deleteInfo.deleteMessage} setnewmessage={handleNewMessage} newmessage={updateMessage} clearmessage={clearUpdateMessage} />
        ) : (
          <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={deleteItem} item={'this Yap'} theme={'bg-white'} text={'text-black'} />
        )}
        <div className="flex justify-center h-full w-full flex-wrap overflow-scroll no-scrollbar overflow-y-auto content-start" ref={outerDivRef}>
          <DisplayAllYaps />
        </div>
        <div className="h-auto w-full flex flex-row justify-center items-end">
          <div className="bg-gray-300 text-black p-6 w-full flex flex-col justify-center text-center">
            <div className="flex flex-row justify-center">
              <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" name="message" placeholder="Enter your message here..." value={userMessage} disabled={isPosting} maxLength={125} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" &&
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
