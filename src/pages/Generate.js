import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import GenerateFlashcards from "../components/GenerateFlashcards";
import GenerateResume from "../components/GenerateResume";

export default function Generate() {

    const { authTokens } = useContext(AuthContext);
    const [subject, setSubject] = useState('');
    const [response, setResponse] = useState(null);
    const [category, setCategory] = useState('');
    const [generate, setGenerate] = useState('flashcards')
    const [nameCategories, setNameCategories] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        try {
            const response = await fetch('https://rbrain.onrender.com/get-categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                }
            })
            const data = await response.json()
            if (response.status === 200) {
                setNameCategories(data.categories.map(category => category.name))
            }
            else {
                console.log("error:", data.detail)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "generate"
    }, [refContent])

    const handleSubmitFlashcards = async (e) => {
        e.preventDefault();
        if (subject) {
            setIsLoading(true)
            try {
                const url = 'https://rbrain.onrender.com/generate-flashcards';
                const body = JSON.stringify({ theme: subject });
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`, // Aquí va el token de ejemplo
                };
                const response = await fetch(url, { method: 'POST', headers, body });

                const data = await response.json();
                setResponse(data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false)
            }
        }
    };

    const handleSubmitResume = async (e) => {
        e.preventDefault();
        if (subject) {
            setIsLoading(true)
            try {
                const response = await fetch('https://rbrain.onrender.com/generate-resume', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authTokens.access_token
                    },
                    body: JSON.stringify({ 'theme': subject })
                })
                const data = await response.json()
                if (response.status === 200) {
                    setResponse(data)
                } else {
                    console.log("Error")
                }
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false)
            }
        }
    }

    const handleChange = (e) => {
        if (e.target.value.split(" ").length <= 4 && e.target.value.length <= 30) {
            setSubject(e.target.value)
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);

    };

    const handleSaveFlashcards = async (e) => {
        e.preventDefault();
        try {
            setResponse("")
            setSubject("")
            if (category) {
                const url = 'https://rbrain.onrender.com/save-flashcards';
                const body = JSON.stringify({ lista_flashcards: response.lista_flashcards, 'theme': subject, 'category': category });
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                };
                const saveResponse = await fetch(url, { method: 'POST', headers, body });
                const saveData = await saveResponse.json();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveResume = async (e) => {
        e.preventDefault();
        try {
            setResponse("")
            setSubject("")
            const saveResponse = await fetch('https://rbrain.onrender.com/save-resume', {
                method: 'POST',
                body: JSON.stringify({ resume: response, theme: subject, category_name: subject }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                }
            })
            const saveData = await saveResponse.json()
            if (saveResponse.status === 201) {
                console.log(saveData)
            } else {
                console.log("Error")
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const generateSelect = (e) => {
        setResponse("")
        setSubject("")
        setIsLoading(false)
        setGenerate(e.target.value)
    }

    return (
        <Content
            refContent={refContent}
            title={"Generate "}
            generate={true}
            generateFlashcards={true}
            generateSelect={generateSelect}
            content={
                <>
                    {generate === 'flashcards' ?
                        <GenerateFlashcards
                            handleSubmitFlashcards={handleSubmitFlashcards}
                            subject={subject}
                            handleChange={handleChange}
                            response={response}
                            isLoading={isLoading}
                            handleSave={handleSaveFlashcards}
                            handleCategoryChange={handleCategoryChange}
                            nameCategories={nameCategories}
                        />

                        :
                        <GenerateResume
                            handleSubmitResume={handleSubmitResume}
                            subject={subject}
                            handleChange={handleChange}
                            response={response}
                            isLoading={isLoading}
                            handleSaveResume={handleSaveResume}
                            handleCategoryChange={handleCategoryChange}
                            nameCategories={nameCategories}
                        />
                    }
                </>
            }
        />
    )
};