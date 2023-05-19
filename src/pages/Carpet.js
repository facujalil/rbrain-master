import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import Card from "../components/Card";
import { useParams } from "react-router-dom";
import LoadingFlashcard from "../skeletonsLoading/LoadingFlashcard";

export default function Carpet() {

    const refMentalMap = useRef();

    const { categoryId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCategoryFlashcards, setCurrentCategoryFlashcards] = useState("");
    const [resume, setResume] = useState("");
    const [mentalMap, setMentalMap] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [typeCarpet, setTypeCarpet] = useState("flashcards");
    const [gridColumns, setGridColumns] = useState(localStorage.gridColumns);
    const loading = [];

    const refContent = useRef();

    useEffect(() => {
        if (typeCarpet === 'mental map') {
            refContent.current.lastChild.firstChild.lastChild.className = "carpet-container-mental-map"
        }
        else {
            refContent.current.lastChild.firstChild.lastChild.className = "carpet-container"
        }
    }, [typeCarpet])

    useEffect(() => {
        refContent.current.parentNode.id = "carpet"
    }, [refContent])

    useEffect(() => {
        getFlashcards();
        getResumes();
        getMentalMaps()
    }, [categoryId, authTokens, logoutUser]);

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
                if (data.flashcards.length > 0) {
                    setFlashcards(data.flashcards);
                }
                else {
                    setErrorMsg('No se encontraron flashcards');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logoutUser();
            }
        } finally {
            setIsLoading(false);
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
    }

    const showTitle = () => {
        if (currentCategoryFlashcards.length > 0) {
            const title = currentCategoryFlashcards[0].toUpperCase() + currentCategoryFlashcards.slice(1)
            return `My carpet ${title}`
        }
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
                body: JSON.stringify(resumeId)
            })

            if (response.status === 202) {
                getResumes()
            }

        } catch (error) {
            console.error(error);
        }
    }

    const getMentalMaps = async () => {
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
                console.log(data)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logoutUser();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getTypeCarpet = (e) => {
        setTypeCarpet(e.target.value)
    }

    for (let i = 0; i < 8; i++) {
        loading.push(<LoadingFlashcard key={i} />)
    }

    let scale = 1;

    const zoom = (event) => {

        const scrollDelta = Math.sign(event.deltaY);
        const zoomStep = 0.1; // Ajusta el valor para controlar el nivel de zoom

        if (scrollDelta > 0) {
            scale -= zoomStep; // Zoom out
        } else {
            scale += zoomStep; // Zoom in
        }

        scale = Math.min(Math.max(0.5, scale), 3); // Limita el nivel de zoom entre 0.5 y 3

        refMentalMap.current.style.transform = `scale(${scale})`;
    }

    return (
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
                content={
                    errorMsg && typeCarpet === 'flashcards' ?
                        errorMsg
                        :
                        <div ref={typeCarpet === 'mental map' ? refMentalMap : null} onWheel={typeCarpet === 'mental map' ? (event) => zoom(event) : null} id={isLoading ? "flashcards-loading" : null} className={gridColumns && typeCarpet !== 'mental map' ? `carpet grid-columns-${gridColumns}` : typeCarpet === 'mental map' ? "container-zoom-mental-map" : "carpet grid-columns-default"}>
                            {isLoading ?
                                <>
                                    {loading}
                                </>
                                :
                                typeCarpet === 'flashcards' ?
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
                                    :
                                    typeCarpet === 'resume' ?
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
                                        :
                                        <Card
                                            showMentalMap={true}
                                            mentalMap={mentalMap}
                                            refMentalMap={refMentalMap}
                                        />
                            }
                        </div >
                }
            />
        </>
    )
};