import React from 'react'
import { createPortal } from 'react-dom'

interface DeleteModalInterface {
  isShowing: boolean;
  hide: () => void;
  deleteitem: () => void;
}

export const DeleteModal = ({ isShowing, hide, deleteitem }: DeleteModalInterface) => isShowing ? createPortal(
  <div className="absolute top-0 right-0 left-0 bottom-0 bg-white w-3/4 h-3/4 m-auto flex flex-col justify-center items-center rounded-2xl">
    <p className="text-3xl my-14">Preparing to delete this Yap.</p>
    <p className="text-2xl my-14">Are you sure you want to delete this Yap?</p>
    <div className="my-10">
      <button className="text-2xl text-white bg-gray-700 px-6 py-2 rounded-lg mx-16" onClick={hide}>Cancel</button>
      <button className="text-2xl text-white bg-red-600 px-6 py-2 rounded-lg mx-16" onClick={deleteitem}>Delete</button>
    </div>
  </div>, document.body
) : null