import React, { useRef, useState, useEffect, useContext } from "react";
import "../css/Flashcard.css";
import AuthContext from "../context/AuthContext";

function Flashcard(props) {

    const [estado, setEstado] = useState(true)
    const [isEditable, setIsEditable] = useState(false)
    const [title, setTitle] = useState(props.title)
    const [info, setInfo] = useState(props.info)

    const { authTokens } = useContext(AuthContext);
    const [newText, setNewText] = useState()

    const refTextarea = useRef()

    useEffect(() => {
        autosize()
    }, [isEditable]);

    const showInfo = () => {
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

    const changeTitle = async (e) => {
        if (newText) {
            setIsEditable(false)
            try {
                const url = 'https://rbrain.onrender.com/edit-flashcard-title';
                const body = JSON.stringify({ 'id': props.flashcardId, 'new_text': newText })
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`, // Aquí va el token de ejemplo
                };
                const response = await fetch(url, { method: 'POST', headers, body });

                const data = await response.json();

                if (response.status === 201) {
                    setTitle(newText)
                }
                console.log(data)

            } catch (error) {
                console.error(error);
            }
        }
    };

    const changeInfo = async (e) => {
        console.log(newText, props.flashcardId)
        if (newText) {
            setIsEditable(false)
            console.log(props.flashcardId, newText)
            try {
                const url = 'https://rbrain.onrender.com/edit-flashcard-info';
                const body = JSON.stringify({ 'id': props.flashcardId, 'new_text': newText })
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`, // Aquí va el token de ejemplo
                };
                const response = await fetch(url, { method: 'POST', headers, body });

                const data = await response.json();

                if (response.status === 201) {
                    setInfo(newText)
                }

                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            {
                props.category ?
                    <div className="flashcard-container">
                        <div onClick={!isEditable ? showInfo : null} className={estado ? "flashcard" : "flashcard info"}>

                            {
                                estado ?
                                    isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeTitle() }}>
                                        <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="flashcard-textarea-title" defaultValue={props.title} /> <button>OK</button>
                                    </form>
                                        :
                                        <p className="flashcard-title">{title}</p>
                                    :
                                    isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeInfo() }}>
                                        <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="flashcard-textarea-info" defaultValue={props.info} /> <button>OK</button>
                                    </form>
                                        :
                                        <p className="flashcard-info">{info}</p>
                            }

                            <p className="flashcard-theme">{props.theme}</p>
                        </div >
                        <button className="btn-change-flashcard" onClick={changeFlashcard}></button>
                    </div>
                    :
                    <div onClick={showInfo} className={estado ? "flashcard" : "flashcard info"}>
                        {estado ?
                            <p className="flashcard-title">{title}</p>
                            :
                            <p className="flashcard-info">{info}</p>
                        }
                    </div>
            }
        </>
    )

}

export default Flashcard;
