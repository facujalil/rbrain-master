import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import Card from "../components/Card";
import { useParams } from "react-router-dom";
import LoadingFlashcard from "../skeletonsLoading/LoadingFlashcard";

export default function Carpet() {

    const { categoryId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCategoryFlashcards, setCurrentCategoryFlashcards] = useState("")
    const [resume, setResume] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [typeCarpet, setTypeCarpet] = useState("flashcards")
    const [gridColumns, setGridColumns] = useState(localStorage.gridColumns)
    const loading = []

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "carpet"
    }, [refContent])

    useEffect(() => {
        getFlashcards();
        getResumes()
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

            setResume(data.resumes)


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

    const getTypeCarpet = (e) => {
        setTypeCarpet(e.target.value)
    }

    for (let i = 0; i < 8; i++) {
        loading.push(<LoadingFlashcard key={i} />)
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
                        <div id={isLoading ? "flashcards-loading" : null} className={gridColumns ? `carpet grid-columns-${gridColumns}` : "carpet grid-columns-default"}>
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
                                    resume.map((resume) =>
                                        <Card
                                            showResume={true}
                                            key={resume.text}
                                            resume={resume.text}
                                            theme={resume.theme}
                                        />
                                    )
                            }
                        </div>
                }
            />
        </>
    )
};