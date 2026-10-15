import { faEllipsis, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useModal } from '~/hooks/useModal'
import { Layout } from '~/components/layout'
import { useSession } from 'next-auth/react'
import { DeleteModal } from '~/modals/delete'
import { EditModal } from '~/modals/edit'
import { SidebarNav } from '~/components/sidebar'
import { api, type RouterOutputs } from '~/utils/api'
import { LoadingPage } from '~/shared/loading'
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"
import toast, { Toaster } from 'react-hot-toast'
import { socket } from "./api/socket-client"

dayjs.extend(relativeTime)

type YapWithLikes = RouterOutputs['yap']['getAllYaps'][number];

type YapFeedProps = {
  yaps: YapWithLikes[] | undefined;
  loading: boolean;
  sessionEmail: string;
  openMenuId: string | null;
  onToggleMenu: (event: React.MouseEvent, id: string) => void;
  onEdit: (yap: YapWithLikes) => void;
  onDelete: (yap: YapWithLikes) => void;
  onLike: (id: string) => void;
};

const YapFeed = ({ yaps, loading, sessionEmail, openMenuId, onToggleMenu, onEdit, onDelete, onLike }: YapFeedProps) => {
  if (loading) return <LoadingPage />

  return (
    <>
      {yaps?.map((allYaps: YapWithLikes) => {
        return (
          <div className="surface-dark relative z-10 m-6 flex h-fit w-full max-w-xs flex-col overflow-visible rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl border-l-4 border-l-yap-gold transition hover:-translate-y-1" key={allYaps.id}>
            <div className="flex items-center justify-between">
              {allYaps.image ? (
                <Image className="m-4 aspect-square rounded-full object-cover ring-2 ring-blue-500" src={allYaps.image} alt="" height={50} width={50} />
              ) : (
                <div className="m-4 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-600 text-xl font-semibold text-gray-400 ring-2 ring-blue-500" title={allYaps.user ?? "User"}>
                  {String(allYaps.user ?? '?').charAt(0).toUpperCase()}
                </div>
              )}
              <p className="text-md font-extralight italic text-gray-300 md:text-lg"><span className="font-extralight text-yap-gold">{dayjs(allYaps.updatedAt).fromNow()}</span></p>
              <div className="relative z-20 flex items-center justify-end overflow-visible pr-2">
                {sessionEmail === allYaps.user && (
                  <button type="button" className="m-4 cursor-pointer" onClick={(event) => onToggleMenu(event, allYaps.id)} aria-label="Yap options">
                    <FontAwesomeIcon icon={faEllipsis} size="xl" />
                  </button>
                )}
                {openMenuId === allYaps.id && sessionEmail === allYaps.user && (
                  <div className="absolute right-2 top-12 z-50 flex w-28 flex-col rounded-xl bg-gray-700 text-center text-lg text-white shadow-xl">
                    <button type="button" className="p-2 hover:bg-gray-600" onClick={() => onEdit(allYaps)}>Edit</button>
                    <button type="button" className="p-2 hover:bg-gray-600" onClick={() => onDelete(allYaps)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
            <p className="px-5 text-left text-xl leading-relaxed">{allYaps.message}</p>
            <div className="m-4 flex flex-grow items-center justify-end align-bottom">
              {allYaps.likes.length > 0 && <p className="text-sm text-gray-300">{allYaps.likes.length}</p>}
              <FontAwesomeIcon className="m-2 cursor-pointer transition hover:scale-110" icon={faHeart} onClick={() => onLike(allYaps.id)} color={allYaps.likes.some((like) => like.user === sessionEmail) ? "red" : "white"} size="xl" />
            </div>
          </div>
        )
      })}
    </>
  )
}

const YapsPage = () => {

  interface DeleteInterface {
    deleteMessage: string | undefined;
    deleteId: string;
  }

  const { data: session } = useSession();

  const [updateMessage, setUpdateMessage] = useState('')
  const [trueEditFalseDelete, setTrueEditFalseDelete] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState<DeleteInterface>({ deleteMessage: '', deleteId: '' })
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { isShowing, toggle } = useModal();
  const outerDivRef = useRef<HTMLDivElement>(null)

  const [userMessage, setUserMessage] = useState('')
  const ctx = api.useContext()
  const { data: yapsFromDatabase, isLoading: loadingYaps } = api.yap.getAllYaps.useQuery()
  const { mutate: likeYap } = api.yap.likeYap.useMutation({
    onSettled: () => {
      void ctx.yap.getAllYaps.invalidate();
    }
  })
  const { mutate: userYap, isLoading: isPosting } = api.yap.postYap.useMutation({
    onSuccess: (createdYap) => {
      // notify other connected clients that a new yap was created
      socket.emit("yap:created", { id: createdYap.id })
    },
    onSettled: () => {
      setUserMessage("");
      void ctx.yap.getAllYaps.invalidate();
    }
  })
  const { mutate: deleteYap } = api.yap.deleteYap.useMutation({
    onSettled: () => {
      void ctx.yap.getAllYaps.invalidate();
    }
  })
  const { mutate: editYap } = api.yap.editYap.useMutation({
    onSettled: () => {
      void ctx.yap.getAllYaps.invalidate();
    }
  });

  const closeMenus = () => {
    setOpenMenuId(null)
  }

  const optionToggle = (event: React.MouseEvent, id: string) => {
    event.stopPropagation()
    setOpenMenuId((current) => (current === id ? null : id))
  }

  const currentDeleteData = (id: string, message?: string) => {
    setDeleteInfo({ deleteId: id, deleteMessage: message })
  }

  const handleNewMessage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdateMessage(e.target.value)
  }

  const clearUpdateMessage = () => {
    setUpdateMessage('')
  }

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

  const deleteItem = () => {
    deleteYap({ id: deleteInfo.deleteId })
    toast.error('Yap deleted!')
    toggle()
  }

  const onEdit = (yap: YapWithLikes) => {
    setOpenMenuId(null)
    setTrueEditFalseDelete(true)
    currentDeleteData(yap.id, yap.message)
    toggle()
  }

  const onDelete = (yap: YapWithLikes) => {
    setOpenMenuId(null)
    setTrueEditFalseDelete(false)
    currentDeleteData(yap.id)
    toggle()
  }

  const handleAllYapSend = () => {
    if (!session?.user?.email) return

    if (userMessage === '') {
      toast.error('Please type a message!')
      return
    }

    const imageUrl = session.user.image
      ? String(session.user.image).startsWith("http")
        ? String(session.user.image)
        : `/${String(session.user.image)}`
      : ""

    userYap({
      message: userMessage,
      user: String(session.user.email),
      image: imageUrl,
    })
    setUserMessage('')
  }

  const setMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value)
  }

  useEffect(() => {
    if (!session?.user?.email) return

    const handleYapCreated = () => {
      void ctx.yap.getAllYaps.invalidate();
    };

    socket.on("yap:created", handleYapCreated);

    return () => {
      socket.off("yap:created", handleYapCreated);
    };
  }, [session?.user?.email, ctx]);

  if (!session) return null

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} />
      <div className="relative flex min-h-0 w-full min-w-0 flex-col items-center justify-center" onClick={closeMenus}>
        {trueEditFalseDelete ? (
          <EditModal isShowing={isShowing} hide={toggle} saveitem={editItem} message={deleteInfo.deleteMessage ?? ''} setnewmessage={handleNewMessage} newmessage={updateMessage} clearmessage={clearUpdateMessage} />
        ) : (
          <DeleteModal isShowing={isShowing} hide={toggle} deleteitem={deleteItem} item={'this Yap'} theme={'bg-white'} text={'text-black'} />
        )}
        <div className="no-scrollbar mb-24 flex h-full w-full min-w-0 flex-wrap content-start justify-center overflow-y-auto overflow-scroll" ref={outerDivRef}>
          <YapFeed
            yaps={yapsFromDatabase}
            loading={loadingYaps}
            sessionEmail={String(session.user.email)}
            openMenuId={openMenuId}
            onToggleMenu={optionToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={(id) => likeYap({ user: String(session.user.email), id })}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-30 min-w-0">
          <div className="border-t border-white/40 bg-white/80 p-3 text-black backdrop-blur-md sm:p-5">
            <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-row">
              <input className="min-w-0 flex-1 rounded-bl-full rounded-tl-full border border-gray-200 bg-white p-3 outline-none focus:border-blue-500" type="text" name="message" placeholder="Enter your message here..." value={userMessage} disabled={isPosting} maxLength={125} onChange={(e) => setMessage(e)} onKeyDown={(e) => e.key === "Enter" &&
                handleAllYapSend()} />
              <button className="shrink-0 rounded-br-full rounded-tr-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 sm:px-5" type="submit" onClick={() => handleAllYapSend()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default YapsPage
