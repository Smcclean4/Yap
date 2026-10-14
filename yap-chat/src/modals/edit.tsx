import React from 'react'
import type { ChangeEventHandler, MouseEventHandler } from 'react'
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
  <>
    <div className="modal-backdrop" onClick={hide} />
    <div className="modal-panel">
      <p className="my-2 text-2xl font-bold">This is your current Yap:</p>
      <p className="my-4 w-full rounded-2xl bg-gray-100 px-6 py-3 text-xl text-gray-600"><i>{message}</i></p>
      <textarea className="field-input my-4 min-h-12 max-h-40" placeholder="Change your Yap here..." minLength={2} maxLength={125} onChange={setnewmessage} value={newmessage} required />
      <div className="my-4 flex gap-4">
        <button className="btn-ghost text-2xl" onMouseUp={clearmessage} onClick={hide}>Cancel</button>
        <button className="btn-primary text-2xl" onClick={saveitem}>Save</button>
      </div>
    </div>
  </>, document.body
) : null
