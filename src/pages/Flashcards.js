import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import EditableCard from "../components/EditableCard";
import { useParams } from "react-router-dom";
import LoadingFlashcards from "../skeletonsLoading/LoadingFlashcards";

export const Flashcards = () => {
    const { categoryId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCategoryFlashcards, setCurrentCategoryFlashcards] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [gridColumns, setGridColumns] = useState('default')

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "flashcards"
    }, [refContent])

    useEffect(() => {
        getFlashcards();
    }, [categoryId, authTokens, logoutUser]);

    const getFlashcards = async () => {
        try {
            const url = `https://rbrain.onrender.com/get-flashcards-by-category?category=${parseInt(categoryId)}`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authTokens.access_token}`,
            };
            const options = {
                method: 'GET',
                headers: headers,
            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.status === 200 && data.msg === 'ok') {
                setCurrentCategoryFlashcards(data.category)
                if (data.flashcards.length > 0) {
                    setFlashcards(data.flashcards);
                }
                else {
                    const errorMsg = 'No se encontraron flashcards';
                    setErrorMsg(errorMsg);
                }
            } else {
                const errorMsg = 'No hay categorías existentes';
                setErrorMsg(errorMsg);
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

    const deleteFlashcard = async (flashcardId) => {
        try {
            const url = 'https://rbrain.onrender.com/delete-flashcard';
            const body = JSON.stringify(flashcardId);
            const headers = {
                'Content-Type': 'text/plain',
                Authorization: `Bearer ${authTokens.access_token}`
            };
            const response = await fetch(url, { method: 'DELETE', headers, body });

            if (response.status === 200) {
                getFlashcards()
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Content
                refContent={refContent}
                title={showTitle()}
                flashcards={true}
                selectGridColumns={true}
                setGridColumns={setGridColumns}
                content={
                    <div id={isLoading ? "flashcards-loading" : null} className={gridColumns ? `flashcards grid-columns-${gridColumns}` : "flashcards"}>
                        {isLoading ?
                            <LoadingFlashcards />
                            :
                            flashcards.map((flashcard) => (
                                <EditableCard
                                    showFlashcards={true}
                                    deleteFlashcard={deleteFlashcard}
                                    key={flashcard.id}
                                    flashcardId={flashcard.id}
                                    title={flashcard.title}
                                    info={flashcard.info}
                                    theme={flashcard.theme}
                                />
                            ))}
                    </div>
                }
            />
        </>
    )
};