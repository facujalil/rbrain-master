import React, { useRef, useState, useEffect } from "react";
import "../css/Flashcard.css";

function Flashcard(props) {

    const [estado, setEstado] = useState(true)
    const [isEditable, setIsEditable] = useState(false)

    const refTextarea = useRef()

    useEffect(() => {
        autosize()
    }, [isEditable]);

    const mostrarInfo = () => {
        setIsEditable(false)
        if (estado === true) {
            return setEstado(false)
        }
        else {
            return setEstado(true)
        }
    }

    const changeFlashcard = () => {
        setIsEditable(!isEditable)
    }

    const autosize = () => {
        const resize = (textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

        if (refTextarea.current) {
            refTextarea.current.setAttribute('rows', 1);
            resize(refTextarea.current);

            refTextarea.current.addEventListener('input', function () {
                resize(refTextarea.current);
            });
        }
    }

    return (
        <>
            {
                props.category ?
                    <div className="flashcard-container">
                        <div onClick={!isEditable ? mostrarInfo : null} className={estado ? "flashcard" : "flashcard info"}>

                            {
                                estado ?
                                    isEditable ? <textarea ref={refTextarea} className="flashcard-textarea-title" defaultValue={props.title} />
                                        :
                                        <p className="flashcard-title">{props.title}</p>
                                    :
                                    isEditable ? <textarea ref={refTextarea} className="flashcard-textarea-info" defaultValue={props.info} />
                                        :
                                        <p className="flashcard-info">{props.info}</p>
                            }

                            <p className="flashcard-theme">{props.theme}</p>
                        </div >
                        <button className="btn-change-flashcard" onClick={changeFlashcard}></button>
                    </div>
                    :
                    <div className="flashcard">
                        <p className="flashcard-title" > {props.title}</p>
                    </div>
            }
        </>
    )

}

export default Flashcard;
