import React, { useRef, useState, useEffect, useContext } from "react";
import "../css/EditableCard.css";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

function EditableCard(props) {

    const [state, setState] = useState(true)
    const [isEditable, setIsEditable] = useState(false)
    const [titleFlashcard, setTitleFlashcard] = useState(props.title)
    const [infoFlashcard, setInfoFlashcard] = useState(props.info)
    const [titleCategory, setTitleCategory] = useState(props.categoryName)

    const { authTokens } = useContext(AuthContext);
    const [newText, setNewText] = useState()
    const [menu, setMenu] = useState(false)

    const refTextarea = useRef()

    useEffect(() => {
        setIsEditable(false)
    }, [])

    useEffect(() => {
        autosize()
    }, [isEditable]);

    const showInfo = () => {
        setIsEditable(false)
        if (state === true) {
            return setState(false)
        }
        else {
            return setState(true)
        }
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

    const changeTitleFlashcard = async (e) => {
        if (newText) {
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
                    setTitleFlashcard(newText)
                }

            } catch (error) {
                console.error(error);
            }
        }
        setIsEditable(false)
    };

    const changeTitleCategory = async (e) => {
        if (newText && newText.split(" ").length <= 4 && newText.length <= 20) {
            try {
                const url = 'https://rbrain.onrender.com/edit-category-name';
                const body = JSON.stringify({ 'current_category_id': props.categoryId, 'new_name': newText })
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`, // Aquí va el token de ejemplo
                };
                const response = await fetch(url, { method: 'PUT', headers, body });

                const data = await response.json();

                if (response.status === 200) {
                    setTitleCategory(newText)
                }

            } catch (error) {
                console.error(error);
            }
        }
        setIsEditable(false)
    };

    const changeInfo = async (e) => {
        if (newText) {
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
                    setInfoFlashcard(newText)
                }
            } catch (error) {
                console.error(error);
            }
        }
        setIsEditable(false)
    };

    return (
        <>
            {
                props.showFlashcards ?
                    <div className="flashcard-container">
                        <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => setMenu(!menu)}></i>
                        {
                            menu ?
                                <div className="menu">
                                    <p onClick={() => { setMenu(false); setIsEditable(!isEditable) }}>Editar</p>
                                    <p onClick={() => props.deleteFlashcard(props.flashcardId)}>Eliminar</p>
                                </div>
                                :
                                null
                        }
                        <div onClick={!isEditable && !menu ? showInfo : null} className={state ? "flashcard" : "flashcard info"}>

                            {
                                state ?
                                    isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeTitleFlashcard() }}>
                                        <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="flashcard-textarea-title" defaultValue={titleFlashcard} /> <button>Change</button>
                                    </form>
                                        :
                                        <div className="flashcard-title"><p>{titleFlashcard}</p></div>
                                    :
                                    isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeInfo() }}>
                                        <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="flashcard-textarea-info" defaultValue={infoFlashcard} /> <button>Change</button>
                                    </form>
                                        :
                                        <div className="flashcard-info"><p>{infoFlashcard}</p></div>
                            }
                            <div className="flashcard-theme"><p>{props.theme}</p></div>
                        </div >

                    </div>
                    :
                    props.showCategories ?
                        <>
                            {
                                !isEditable ?
                                    <div className="category">
                                        <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => setMenu(!menu)}></i>
                                        {
                                            menu ?
                                                <div className="menu">
                                                    <p onClick={() => { setMenu(false); setIsEditable(!isEditable) }}>Editar</p>
                                                    <p onClick={() => props.deleteCategory(props.categoryId)}>Eliminar</p>
                                                </div>
                                                :
                                                null
                                        }
                                        <Link className="category-link" to={!menu ? `/profile/my-flashcards/${props.categoryId}` : null}>
                                            <p className="category-title">{titleCategory}</p>
                                        </Link>
                                    </div>
                                    :
                                    <div className="category" >
                                        <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => setIsEditable(!isEditable)}></i>
                                        <form onSubmit={(e) => { e.preventDefault(); changeTitleCategory() }}>
                                            <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="category-textarea-title" defaultValue={titleCategory} /> <button>Change</button>
                                        </form>
                                    </div>
                            }
                        </>
                        :
                        <div className="flashcard-container">
                            <div onClick={showInfo} className={state ? "flashcard" : "flashcard info"}>
                                {state ?
                                    <div className="flashcard-title"><p>{props.title}</p></div>
                                    :
                                    <div className="flashcard-info"><p>{props.info}</p></div>
                                }
                                <div className="flashcard-theme"><p>{props.theme}</p></div>
                            </div>
                        </div>
            }
        </>
    )

}

export default EditableCard;