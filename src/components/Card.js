import React, { useRef, useState, useEffect, useContext } from "react";
import "../css/Card.css";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Card(props) {

    const [state, setState] = useState(true)
    const [isEditable, setIsEditable] = useState(false)
    const [titleFlashcard, setTitleFlashcard] = useState(props.title)
    const [infoFlashcard, setInfoFlashcard] = useState(props.info)
    const [titleCategory, setTitleCategory] = useState(props.categoryName)
    const [resume, setResume] = useState(props.resume)
    const [fullResume, setFullResume] = useState(false)

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
                const response = await fetch('https://rbrain.onrender.com/edit-flashcard-title', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ 'id': props.flashcardId, 'new_text': newText })
                })

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
        if (newText) {
            try {
                const response = await fetch('https://rbrain.onrender.com/edit-category-name', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ 'current_category_id': props.categoryId, 'new_name': newText })

                })

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
                const response = await fetch('https://rbrain.onrender.com/edit-flashcard-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ 'id': props.flashcardId, 'new_text': newText })

                })

                if (response.status === 201) {
                    setInfoFlashcard(newText)
                }
            } catch (error) {
                console.error(error);
            }
        }
        setIsEditable(false)
    };

    const changeResume = async (e) => {
        if (newText) {
            try {
                const response = await fetch('https://rbrain.onrender.com/resume', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ 'id': props.resumeId, 'new_resume': newText })

                })

                if (response.status === 202) {
                    setResume(newText)
                    setFullResume(false)
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
                props.showCategories ?
                    <>
                        {
                            !isEditable ?
                                <div className="category">
                                    <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => !isEditable ? setMenu(!menu) : null}></i>
                                    {
                                        menu ?
                                            <div className="menu">
                                                <p onClick={() => { setMenu(false); setIsEditable(!isEditable) }}>Editar</p>
                                                <p onClick={() => props.deleteCategory(props.categoryId)}>Eliminar</p>
                                            </div>
                                            :
                                            null
                                    }
                                    <Link className="category-link" to={!menu ? `/profile/my-carpet/${props.categoryId}` : null}>
                                        <p className="category-title">{titleCategory}</p>
                                    </Link>
                                </div>
                                :
                                <div className="category" >
                                    <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => !isEditable ? setMenu(!menu) : null}></i>
                                    <form onSubmit={(e) => { e.preventDefault(); changeTitleCategory() }}>
                                        <textarea maxLength={30} onChange={(e) => e.target.value ? e.target.value.split(" ").length <= 4 ? setNewText(e.target.value) : null : setNewText(props.titleCategory)} ref={refTextarea} className="category-textarea-title" defaultValue={titleCategory} /> <button>Change</button>
                                    </form>
                                </div>
                        }
                    </>

                    :

                    props.showFlashcards ?

                        <div className="flashcard-container">
                            <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => !isEditable ? setMenu(!menu) : null}></i>
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
                                            <textarea maxLength={60} onChange={(e) => e.target.value ? setNewText(e.target.value) : setNewText(props.titleFlashcard)} ref={refTextarea} className="flashcard-textarea-title" defaultValue={titleFlashcard} /> <button>Change</button>
                                        </form>
                                            :
                                            <div className="flashcard-title"><p>{titleFlashcard}</p></div>
                                        :
                                        isEditable ? <form onSubmit={(e) => { e.preventDefault(); changeInfo() }}>
                                            <textarea maxLength={120} onChange={(e) => e.target.value ? setNewText(e.target.value) : setNewText(props.infoFlashcard)} ref={refTextarea} className="flashcard-textarea-info" defaultValue={infoFlashcard} /> <button>Change</button>
                                        </form>
                                            :
                                            <div className="flashcard-info"><p>{infoFlashcard}</p></div>
                                }
                                <div className="flashcard-theme"><p>{props.theme}</p></div>
                            </div >

                        </div>

                        :

                        props.showResume ?
                            <div className="resume-container">
                                <i className="btn-menu fa-solid fa-ellipsis-vertical" onClick={() => !isEditable ? setMenu(!menu) : null}></i>
                                {
                                    menu ?
                                        <div className="menu">
                                            <p onClick={() => { setMenu(false); setIsEditable(!isEditable) }}>Editar</p>
                                            <p onClick={() => props.deleteResume(props.resumeId)}>Eliminar</p>
                                        </div>
                                        :
                                        null
                                }
                                <div className="resume" onClick={() => setFullResume(!fullResume)}>
                                    {
                                        isEditable ?
                                            <form onSubmit={(e) => { e.preventDefault(); changeResume() }}>
                                                <textarea onChange={(e) => e.target.value ? setNewText(e.target.value) : setNewText(props.titleFlashcard)} ref={refTextarea} className="resume-textarea-info" defaultValue={resume} /> <button>Change</button>
                                            </form>
                                            :
                                            <>
                                                <div className={fullResume ? "full-resume-info" : "resume-info"}><p>{resume}</p></div>
                                            </>
                                    }
                                    <div className="resume-theme"><p>{props.theme}</p></div>
                                </div>
                            </div>

                            :

                            props.generateResume ?
                                <div className="resume-container" onClick={() => setFullResume(!fullResume)}>
                                    <div className="resume">
                                        <div className={fullResume ? "full-resume-info" : "resume-info"}><p>{props.resume}</p></div>
                                        <div className="resume-theme"><p>{props.theme}</p></div>
                                    </div>
                                </div>

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