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

    const changeTitleFlashcard = async (e) => {
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
                    setTitleFlashcard(newText)
                }

            } catch (error) {
                console.error(error);
            }
        }
    };

    const changeTitleCategory = async (e) => {
        if (newText && newText.split(" ").length <= 4 && newText.length <= 20) {
            setIsEditable(false)
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
    };

    const changeInfo = async (e) => {
        if (newText) {
            setIsEditable(false)
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

                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            {
                props.showFlashcards ?
                    <div className="flashcard-container">
                        <button className="btn-delete-flashcard" onClick={() => props.deleteFlashcard(props.flashcardId)}>X</button>
                        <div onClick={!isEditable ? showInfo : null} className={state ? "flashcard" : "flashcard info"}>

                            {
                                state ?
                                    isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeTitleFlashcard() }}>
                                        <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="flashcard-textarea-title" defaultValue={titleFlashcard} /> <button>OK</button>
                                    </form>
                                        :
                                        <p className="flashcard-title">{titleFlashcard}</p>
                                    :
                                    isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeInfo() }}>
                                        <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="flashcard-textarea-info" defaultValue={infoFlashcard} /> <button>OK</button>
                                    </form>
                                        :
                                        <p className="flashcard-info">{infoFlashcard}</p>
                            }

                            <p className="flashcard-theme">{props.theme}</p>
                        </div >
                        <button className="btn-change-flashcard" onClick={() => setIsEditable(!isEditable)}></button>
                    </div>
                    :
                    props.showCategories ?
                        <>
                            <button className="btn-delete-category" onClick={() => props.deleteCategory(props.categoryId)}>X</button>
                            {
                                !isEditable ?
                                    <Link className="category" to={`/profile/my-flashcards/${props.categoryId}`}>
                                        <p className="category-title">{titleCategory}</p>
                                    </Link>
                                    :
                                    <div className="category" >
                                        <form onSubmit={(e) => { e.preventDefault(); changeTitleCategory() }}>
                                            <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : null} ref={refTextarea} className="category-textarea-title" defaultValue={titleCategory} /> <button>OK</button>
                                        </form>
                                    </div>
                            }
                            <button className="btn-change-category" onClick={() => setIsEditable(!isEditable)}></button>
                        </>
                        :
                        <div onClick={showInfo} className={state ? "flashcard" : "flashcard info"}>
                            {state ?
                                <p className="category-title">{props.title}</p>
                                :
                                <p className="category-info">{props.info}</p>
                            }
                            <p className="flashcard-theme">{props.theme}</p>
                        </div>
            }
        </>
    )

}

export default EditableCard;