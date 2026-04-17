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
  <div className="fixed top-0 right-0 left-0 bottom-0 bg-white w-3/4 h-3/4 m-auto flex flex-col justify-center items-center rounded-2xl z-[9999]">
    <div className="w-full flex justify-between p-6 top-0 absolute">
      <FontAwesomeIcon className="text-4xl text-red-500 cursor-pointer" onClick={hide} icon={faXmark} />
      <div className="flex justify-end">
        <FontAwesomeIcon className="cursor-pointer" icon={faToiletPaper} size="xl" onClick={onclosechat} />
      </div>
    </div>
    <div className="bg-gray-100 h-4/5 w-4/5 flex flex-col justify-center items-center">
      <p>Messaging: {user}!</p>
      <p>This is the chat box.</p>
      <div className="h-full w-full overflow-scroll flex flex-col">
        {!loading ? messages?.chat?.map((msg: ChatRow, id: Key) => (
          <div className={`w-full flex ${msg.user === sessionUser ? 'justify-end' : 'justify-start'}`} key={id}>
            <ul className={`m-8 text-xl text-white w-1/4 min-w-[300px] overflow-x-scroll ${msg.user === sessionUser ? 'text-right bg-blue-500 rounded-tl-md rounded-bl-md rounded-br-md' : 'bg-gray-500 rounded-tr-md rounded-bl-md rounded-br-md'}`}><li className="m-2"><p>{msg.user === sessionUser ? <b className="underline">You</b> : <b className="underline">{user}</b>}</p><p>{msg.message}</p></li></ul>
          </div>
        )) : <LoadingPage />}
      </div>
    </div>
    <div className="flex flex-row justify-center w-4/5 bg-gray-200 p-4">
      <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" value={message} type="text" name="message" placeholder="Enter your message here..." maxLength={125} onChange={storewords} onKeyDown={(e) => e.key === "Enter" &&
        sendmessage()} disabled={loadingmessages} />
      <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={sendmessage}>Send</button>
    </div>
  </div>, document.body
) : null
