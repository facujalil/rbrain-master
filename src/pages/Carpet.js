import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import Card from "../components/Card";
import { useParams } from "react-router-dom";
import LoadingFlashcard from "../skeletonsLoading/LoadingFlashcard";
import LoadingResume from "../skeletonsLoading/LoadingResume";

export default function Carpet() {

    const { categoryId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCategoryFlashcards, setCurrentCategoryFlashcards] = useState("");
    const [resume, setResume] = useState("");
    const [mentalMap, setMentalMap] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [typeCarpet, setTypeCarpet] = useState("flashcards");
    const [gridColumns, setGridColumns] = useState(localStorage.gridColumns);
    const [modal, setModal] = useState(false)
    const [inputModal, setInputModal] = useState("")
    const [inputModalTitle, setInputModalTitle] = useState("")
    const refTextarea = useRef()
    const [textareaModal, setTextareaModal] = useState("")
    const [isNewCardLoading, setIsNewCardLoading] = useState(false)
    const loading = [];

    const refContent = useRef();

    useEffect(() => {
        refContent.current.parentNode.id = "carpet"
    }, [refContent])

    useEffect(() => {
        getFlashcards();
        getResumes();
        getCardMentalMaps()
    }, [categoryId, authTokens, logoutUser, typeCarpet]);

    useEffect(() => {
        autosize()
    }, [textareaModal]);

    const getFlashcards = async () => {
        try {
            const response = await fetch(`https://rbrain.onrender.com/get-flashcards-by-category?category=${parseInt(categoryId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                }
            })

            const data = await response.json();

            if (response.status === 200) {
                setCurrentCategoryFlashcards(data.category)
                setFlashcards(data.flashcards);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logoutUser();
            }
        } finally {
            setIsLoading(false);
            setIsNewCardLoading(false)
        }
    };

    const getResumes = async () => {
        try {
            const response = await fetch(`https://rbrain.onrender.com/resumes-by-category?category_id=${parseInt(categoryId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                }
            })

            const data = await response.json();

            if (response.status === 200) {
                setResume(data.resumes)
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsNewCardLoading(false)
        }
    }

    const getCardMentalMaps = async () => {
        try {
            const response = await fetch(`https://rbrain.onrender.com/get-mental-maps-by-category`, {
                method: 'POST',
                body: JSON.stringify({ category: categoryId }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                }
            })

            const data = await response.json();

            if (response.status === 200) {
                setMentalMap(data.mental_maps)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logoutUser();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const showTitle = () => {
        if (currentCategoryFlashcards.length > 0) {
            const title = currentCategoryFlashcards[0].toUpperCase() + currentCategoryFlashcards.slice(1)
            return `My carpet ${title}`
        }
    }

    const getTypeCarpet = (e) => {
        setTypeCarpet(e.target.value)
    }

    const deleteFlashcard = async (flashcardId) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/delete-flashcard', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                },
                body: JSON.stringify(flashcardId)
            })

            if (response.status === 200) {
                getFlashcards()
            }
        } catch (error) {
            console.error(error);
        }
    }

    const deleteResume = async (resumeId) => {
        try {

            const response = await fetch('https://rbrain.onrender.com/resume', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                },
                body: JSON.stringify({ resume_id: resumeId })
            })

            if (response.status === 202) {
                getResumes()
            }

        } catch (error) {
            console.error(error);
        }
    }

    const deleteCardMentalMap = async (cardMentalMapId) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/mental-map', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                },
                body: JSON.stringify({ map_id: cardMentalMapId })
            })

            if (response.status === 200) {
                getCardMentalMaps()
            }

        } catch (error) {
            console.error(error);
        }
    }

    const autosize = () => {
        const resize = (textarea) => {
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

    const getInputModal = (e) => {
        if (e.target.value.split(" ").length <= 4 && e.target.value.length <= 30) {
            setInputModal(e.target.value)
        }
    }

    const getInputModalTitle = (e) => {
        if (e.target.value.split(" ").length <= 4 && e.target.value.length <= 30) {
            setInputModalTitle(e.target.value)
        }
    }

    const getTextareaModal = (e) => {
        if (typeCarpet === "flashcards") {
            if (e.target.value.length <= 120) {
                setTextareaModal(e.target.value)
            }
        }
        else {
            setTextareaModal(e.target.value)
        }
    }

    const closeModal = () => {
        setModal(false)
    }

    const addFlashcard = () => {
        setInputModalTitle("")
        setInputModal("")
        setTextareaModal("")
        setModal(true)
    }

    const addResume = () => {
        setInputModal("")
        setTextareaModal("")
        setModal(true)
    }

    const addNewFlashcard = async (e) => {
        e.preventDefault()
        if (inputModalTitle && inputModal && textareaModal) {
            setIsNewCardLoading(true)
            setModal(false)
            try {
                const response = await fetch('https://rbrain.onrender.com/create-flashcard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ title: inputModalTitle, info: textareaModal, theme: inputModal, category_id: categoryId })
                })

                if (response.status === 201) {
                    getFlashcards()
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const addNewResume = async (e) => {
        e.preventDefault()
        if (inputModal && textareaModal) {
            setIsNewCardLoading(true)
            setModal(false)
            try {
                const response = await fetch('https://rbrain.onrender.com/create-resume', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ theme: inputModal, text: textareaModal, category_id: categoryId })
                })

                if (response.status === 201) {
                    getResumes();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    for (let i = 0; i < 8; i++) {
        loading.push(<LoadingFlashcard key={i} />)
    }

    return (
        <>
            {modal ? <> <div onClick={closeModal} className="modal"></div>
                <div className="container-form-modal">
                    <form className="form-modal">
                        <label>{typeCarpet === 'flashcards' ? "Add new flashcard" : "Add new resume"}</label>
                        {typeCarpet === 'flashcards' ?
                            <input value={inputModalTitle} className="modal-input" onChange={getInputModalTitle} placeholder="Title" />
                            :
                            null
                        }
                        <input value={inputModal} className="modal-input" onChange={getInputModal} placeholder="Theme" />
                        <textarea ref={refTextarea} value={textareaModal} className="modal-textarea" onChange={getTextareaModal} placeholder="Content" />
                        <button className="btn-modal" onClick={typeCarpet === 'flashcards' ? addNewFlashcard : addNewResume}>Add</button>
                    </form>
                </div>
            </>
                : null}
            <>
                <Content
                    refContent={refContent}
                    title={showTitle()}
                    carpet={true}
                    selectTypeCarpet={true}
                    getTypeCarpet={getTypeCarpet}
                    selectGridColumns={true}
                    setGridColumns={setGridColumns}
                    gridColumns={gridColumns}
                    add={typeCarpet !== 'mental maps' ? true : false}
                    addElement={typeCarpet === 'flashcards' ? addFlashcard : addResume}
                    content={
                        <div id={isLoading ? "flashcards-loading" : null} className={gridColumns ? `carpet grid-columns-${gridColumns}` : "carpet grid-columns-default"}>
                            {isLoading ?
                                <>
                                    {loading}
                                </>
                                :
                                typeCarpet === 'flashcards' && flashcards ?
                                    flashcards.length > 0 || isNewCardLoading ?
                                        <>
                                            {
                                                flashcards.map((flashcard) => (
                                                    <Card
                                                        showFlashcards={true}
                                                        deleteFlashcard={deleteFlashcard}
                                                        key={flashcard.id}
                                                        flashcardId={flashcard.id}
                                                        title={flashcard.title}
                                                        info={flashcard.info}
                                                        theme={flashcard.theme}
                                                    />
                                                ))
                                            }
                                            {
                                                isNewCardLoading ?
                                                    <LoadingFlashcard />
                                                    :
                                                    null
                                            }
                                        </>
                                        :
                                        !isNewCardLoading ?
                                            <p className="msg-error">No se encontraron flashcards</p>
                                            :
                                            null
                                    :
                                    typeCarpet === 'resumes' && resume ?
                                        resume.length > 0 || isNewCardLoading ?
                                            <>
                                                {
                                                    resume.map((resume) =>
                                                        <Card
                                                            showResume={true}
                                                            key={resume.id}
                                                            resumeId={resume.id}
                                                            deleteResume={deleteResume}
                                                            resume={resume.text}
                                                            theme={resume.theme}
                                                        />
                                                    )
                                                }
                                                {
                                                    isNewCardLoading ?
                                                        <LoadingResume />
                                                        :
                                                        null
                                                }
                                            </>
                                            :
                                            !isNewCardLoading ?
                                                <p className="msg-error">No se encontraron resumes</p>
                                                :
                                                null
                                        :
                                        mentalMap.length > 0 ?
                                            <>
                                                {mentalMap.map((mentalMap) => (
                                                    <Card
                                                        showCardMentalMap={true}
                                                        name={mentalMap.name}
                                                        cardMentalMapId={mentalMap.id}
                                                        categoryId={categoryId}
                                                        key={mentalMap.id}
                                                        deleteCardMentalMap={deleteCardMentalMap}
                                                    />
                                                ))}
                                            </>
                                            :
                                            <p className="msg-error">No se encontraron mental maps</p>
                            }
                        </div >
                    }
                />
            </>
        </>
    )
};
