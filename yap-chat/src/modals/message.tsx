import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { createPortal } from 'react-dom'

interface MessageInterface {
  isShowing: boolean;
  hide: () => void;
  sendmessage: () => void;
  messages: string;
  user: string;
  chatoptions?: boolean;
  chatoptionsclick?: () => void;
  onclosechat?: () => void;
}

export const MessageModal = ({ isShowing, hide, sendmessage, messages, user, chatoptions, chatoptionsclick, onclosechat }: MessageInterface) => isShowing ? createPortal(
  <div className="absolute top-0 right-0 left-0 bottom-0 bg-white w-3/4 h-3/4 m-auto flex flex-col justify-center items-center rounded-2xl">
    <div className="w-full flex justify-between p-6 top-0 absolute">
      <p className="text-4xl text-red-500 cursor-pointer" onClick={hide}>x</p>
      <div className="flex justify-end">
        <FontAwesomeIcon className="cursor-pointer" icon={faEllipsis} size="2xl" onFocus={chatoptionsclick} onBlur={chatoptionsclick} tabIndex={0} />
        {chatoptions && (
          <div className="absolute bg-gray-700 text-white">
            <button className="p-2" onClick={onclosechat}>Close Chat</button>
          </div>
        )}
      </div>
    </div>
    <div className="bg-gray-100 h-4/5 w-4/5 flex flex-col justify-center items-center">
      <p>Messaging: {user}!</p>
      <p>This is the chat box.</p>
      <p>{messages}</p>
    </div>
    <div className="flex flex-row justify-center w-4/5 bg-gray-200 p-4">
      <input className="p-2 rounded-tl-full rounded-bl-full w-full max-w-3xl" type="text" name="message" placeholder="Enter your message here..." maxLength={125} />
      <button className="px-4 py-2  text-white bg-blue-400 hover:bg-blue-500 rounded-tr-full rounded-br-full" type="submit" onClick={sendmessage}>Send</button>
    </div>
  </div>, document.body
) : null