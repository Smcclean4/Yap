import React, { ChangeEventHandler, MouseEventHandler } from 'react'
import { createPortal } from 'react-dom'

interface EditModalInterface {
  isShowing: boolean;
  hide: () => void;
  saveitem: MouseEventHandler<HTMLButtonElement>;
  message: string;
  setnewmessage: ChangeEventHandler<HTMLTextAreaElement>;
  newmessage: string;
  clearmessage: MouseEventHandler<HTMLButtonElement>;
}

export const EditModal = ({ isShowing, hide, saveitem, message, setnewmessage, newmessage, clearmessage }: EditModalInterface) => isShowing ? createPortal(
  <div className="absolute top-0 right-0 left-0 bottom-0 bg-white w-3/4 h-3/4 m-auto flex flex-col justify-center items-center rounded-2xl">
    <p className="text-2xl my-4">This is your current Yap:</p>
    <p className="text-xl text-gray-600 my-4 bg-gray-200 px-8 py-2 w-2/4"><i>{message}</i></p>
    <textarea className="text-xl border-2 pl-4 w-2/4 max-h-40 min-h-12 my-6" placeholder="Change your Yap here..." minLength={2} maxLength={125} onChange={setnewmessage} value={newmessage} required />
    <div className="my-10">
      <button className="text-2xl text-white bg-gray-700 px-6 py-2 rounded-lg mx-16" onMouseUp={clearmessage} onClick={hide}>Cancel</button>
      <button className="text-2xl text-white bg-blue-600 px-6 py-2 rounded-lg mx-16" onClick={saveitem}>Save</button>
    </div>
  </div>, document.body
) : null