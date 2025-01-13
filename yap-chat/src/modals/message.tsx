import { faToiletPaper, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPortal } from 'react-dom'
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, Key } from 'react';

interface MessageInterface {
  isShowing: boolean;
  hide: () => void;
  storewords: (e: any) => void;
  sendmessage: () => void;
  message: string;
  messages: any;
  user: string;
  onclosechat?: () => void;
}

export const MessageModal = ({ isShowing, hide, storewords, sendmessage, message, messages, user, onclosechat }: MessageInterface) => isShowing ? createPortal(
  <div className="absolute top-0 right-0 left-0 bottom-0 bg-white w-3/4 h-3/4 m-auto flex flex-col justify-center items-center rounded-2xl">
    <div className="w-full flex justify-between p-6 top-0 absolute">
      <FontAwesomeIcon className="text-4xl text-red-500 cursor-pointer" onClick={hide} icon={faXmark} />
      <div className="flex justify-end">
        <FontAwesomeIcon className="cursor-pointer" icon={faToiletPaper} size="xl" onClick={onclosechat} />
      </div>
    </div>
    <div className="bg-gray-100 h-4/5 w-4/5 flex flex-col justify-center items-center">
      <p>Messaging: {user}!</p>
      <p>This is the chat box.</p>
      <div className="h-full w-full overflow-scroll px-48">
        {messages.map((message: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined, id: Key | null | undefined) => <ul key={id}><li className="m-2">{message}</li></ul>)}
      </div>
    </div>
    <div className="flex flex-row justify-center w-4/5 bg-gray-200 p-4">
      <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" value={message} type="text" name="message" placeholder="Enter your message here..." maxLength={125} onChange={(e) => storewords(e)} onKeyDown={(e) => e.key === "Enter" &&
        sendmessage()} />
      <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={sendmessage}>Send</button>
    </div>
  </div>, document.body
) : null