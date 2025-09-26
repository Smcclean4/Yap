import React from "react";
import { createPortal } from "react-dom";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RequestInterface {
  isShowing: boolean;
  hide: () => void;
  user: any;
  sendrequest: () => void;
}

export const RequestModal = ({ isShowing, hide, user, sendrequest }: RequestInterface) => isShowing ? createPortal(
  <div className='absolute top-0 right-0 left-0 bottom-0 w-3/4 h-3/4 m-auto flex flex-col text-center justify-center items-center rounded-2xl bg-gray-600'>
    <p className="text-3xl text-white my-10">Are you sure you want to send {user} a friend request?</p>
    <div className="my-10">
      <button className="text-2xl text-white bg-gray-700 px-6 py-2 rounded-lg mx-16" onClick={hide}>Cancel</button>
      <button className="text-2xl text-white bg-red-600 px-6 py-2 rounded-lg mx-16" onClick={sendrequest}>Send</button>
    </div>
  </div>, document.body
) : null