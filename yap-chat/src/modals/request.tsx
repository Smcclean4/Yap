import React from "react";
import { createPortal } from "react-dom";

interface RequestInterface {
  isShowing: boolean;
  hide: () => void;
  user: string | null;
  sendrequest: () => void;
}

export const RequestModal = ({ isShowing, hide, user, sendrequest }: RequestInterface) => isShowing ? createPortal(
  <>
    <div className="modal-backdrop" onClick={hide} />
    <div className='modal-panel-dark text-center'>
      <p className="my-6 text-3xl font-bold text-white">Send {user} a friend request?</p>
      <div className="my-6 flex justify-center gap-4">
        <button className="btn-ghost text-2xl" onClick={hide}>Cancel</button>
        <button className="btn-primary text-2xl" onClick={sendrequest}>Send</button>
      </div>
    </div>
  </>, document.body
) : null
