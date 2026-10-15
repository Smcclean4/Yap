import { faToiletPaper, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPortal } from 'react-dom'
import type { Key } from 'react';
import type { ChangeEventHandler } from 'react';
import { LoadingPage } from '~/shared/loading';
import type { RouterOutputs } from '~/utils/api';

type ChatMessagesResult = RouterOutputs['messenger']['getChatMessages'];
type ChatRow = NonNullable<NonNullable<ChatMessagesResult>['chat']>[number];

interface MessageInterface {
  isShowing: boolean;
  hide: () => void;
  storewords: ChangeEventHandler<HTMLInputElement>;
  sendmessage: () => void;
  message: string;
  loadingmessages: boolean;
  messages: ChatMessagesResult | undefined;
  sessionUser: string;
  user: string;
  onclosechat?: () => void;
  loading: boolean;
}

export const MessageModal = ({ isShowing, hide, storewords, loadingmessages, sendmessage, message, messages, sessionUser, user, onclosechat, loading }: MessageInterface) => isShowing ? createPortal(
  <>
    <div className="modal-backdrop" onClick={hide} />
    <div className="fixed inset-0 z-[9999] m-auto flex h-[80vh] w-[90%] max-w-4xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl">
      <div className="absolute top-0 flex w-full items-center justify-between border-b border-gray-100 bg-blue-500 px-6 py-4 text-white">
        <FontAwesomeIcon className="cursor-pointer text-3xl text-white hover:text-red-200" onClick={hide} icon={faXmark} />
        <p className="text-lg font-bold">Messaging {user}</p>
        <FontAwesomeIcon className="cursor-pointer" icon={faToiletPaper} size="xl" onClick={onclosechat} />
      </div>
      <div className="mt-16 flex h-4/5 w-full flex-col items-center justify-center bg-gray-50">
        <div className="flex h-full w-full flex-col overflow-scroll">
          {!loading ? messages?.chat?.map((msg: ChatRow, id: Key) => (
            <div className={`flex w-full ${msg.user === sessionUser ? 'justify-end' : 'justify-start'}`} key={id}>
              <ul className={`m-6 min-w-[240px] w-1/3 overflow-x-scroll rounded-2xl text-xl text-white ${msg.user === sessionUser ? 'bg-blue-500' : 'bg-gray-600'}`}><li className="m-3"><p>{msg.user === sessionUser ? <b className="text-yap-gold">You</b> : <b className="text-yap-gold">{user}</b>}</p><p>{msg.message}</p></li></ul>
            </div>
          )) : <LoadingPage />}
        </div>
      </div>
      <div className="flex w-full flex-row justify-center bg-white p-4">
        <input className="w-full max-w-3xl rounded-bl-full rounded-tl-full border border-gray-200 p-3 outline-none focus:border-blue-500" value={message} type="text" name="message" placeholder="Enter your message here..." maxLength={125} onChange={storewords} onKeyDown={(e) => e.key === "Enter" &&
          sendmessage()} disabled={loadingmessages} />
        <button className="rounded-br-full rounded-tr-full bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-600" type="submit" onClick={sendmessage}>Send</button>
      </div>
    </div>
  </>, document.body
) : null
