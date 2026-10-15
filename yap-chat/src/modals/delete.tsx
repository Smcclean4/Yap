import React from 'react'
import { createPortal } from 'react-dom'

interface DeleteModalInterface {
  isShowing: boolean;
  item: string;
  theme: string;
  text: string;
  hide: () => void;
  deleteitem: () => void;
}

export const DeleteModal = ({ isShowing, hide, deleteitem, item, theme, text }: DeleteModalInterface) => isShowing ? createPortal(
  <>
    <div className="modal-backdrop" onClick={hide} />
    <div className={`modal-panel ${theme.includes('gray-900') ? 'modal-panel-dark' : ''} ${text}`}>
      <div className="accent-bar mb-6" />
      <p className="my-4 text-xl font-bold sm:text-3xl">Preparing to delete {item}.</p>
      <p className="my-4 text-lg opacity-70 sm:text-2xl">Are you sure you want to delete {item}?</p>
      <div className="my-6 flex gap-4">
        <button className="btn-ghost text-lg sm:text-2xl" onClick={hide}>Cancel</button>
        <button className="btn-danger text-lg sm:text-2xl" onClick={deleteitem}>Delete</button>
      </div>
    </div>
  </>, document.body
) : null
