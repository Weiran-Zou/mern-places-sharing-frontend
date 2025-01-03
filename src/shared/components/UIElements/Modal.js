import React from "react";
import {createPortal} from "react-dom"
import "./Modal.css"
import BackDrop from "./BackDrop"

const ModalOverlay = (props) => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault}>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>

        </div>
    )
    return createPortal(content ,document.getElementById("modal-hook"));
}

const Modal = (props) => {
    return (
        <>
        {props.show && (
          <>
            <BackDrop onClick={props.onCancel} />
            <ModalOverlay {...props} />
          </>
        )}
      </>
      
    )
}

export default Modal;