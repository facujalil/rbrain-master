import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import GenerateFlashcards from "../components/GenerateFlashcards";
import GenerateResume from "../components/GenerateResume";
import GenerateMentalMap from "../components/GenerateMentalMap";

export default function Generate() {

    const { authTokens } = useContext(AuthContext);
    const [subject, setSubject] = useState('');
    const [response, setResponse] = useState(null);
    const [resume, setResume] = useState([]);
    const [category, setCategory] = useState('');
    const [mentalMap, setMentalMap] = useState([]);
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

    const testHandleSubmitFlashcards = (e) => {
        e.preventDefault();
        setResponse({ lista_flashcards: [{ title: 'title', info: 'info' }, { title: 'title', info: 'info' }, { title: 'title', info: 'info' }, { title: 'title', info: 'info' }], theme: subject })
    }

    const handleSubmitFlashcards = async (e) => {
        e.preventDefault();
        if (subject) {
            setIsLoading(true)
            try {
                const response = await fetch('https://rbrain.onrender.com/generate-flashcards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authTokens.access_token
                    },
                    body: JSON.stringify({ theme: subject })
                })
                const data = await response.json();
                setResponse({ lista_flashcards: data.lista_flashcards, theme: subject });
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false)
            }
        }
    };

    const testHandleSubmitResume = (e) => {
        e.preventDefault();
        setResume({ info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", theme: subject })
    }

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
                    setResume({ info: data, theme: subject })
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

    const handleSubmitMentalMap = async (e) => {
        e.preventDefault();
        if (subject) {
            setIsLoading(true)
            try {
                const response = await fetch('https://rbrain.onrender.com/generate-mental-map', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ theme: subject })
                })

                const data = await response.json();

                setMentalMap(data.mental_map)

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
            if (category) {
                const saveResponse = await fetch('https://rbrain.onrender.com/save-flashcards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authTokens.access_token
                    },
                    body: JSON.stringify({ lista_flashcards: response.lista_flashcards, 'theme': subject, 'category': category })
                })

                const data = await saveResponse.json();
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setSubject("")
            setResponse("")
        }
    };

    const handleSaveResume = async (e) => {
        e.preventDefault();
        try {
            const saveResponse = await fetch('https://rbrain.onrender.com/save-resume', {
                method: 'POST',
                body: JSON.stringify({ resume: resume.info, theme: subject, category_name: category }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                }
            })

            const data = await saveResponse.json()
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setSubject("")
            setResume("")
        }
    }

    const handleSaveMentalMap = async (e) => {
        e.preventDefault();
        const content = {
            key1: "valor1",
            key2: "valor2",
            // Otros datos en formato JSON
        };
        try {
            const saveResponse = await fetch('https://rbrain.onrender.com/mental-map', {
                method: 'POST',
                body: JSON.stringify({
                    user_theme: subject,
                    user_category: category,
                    user_content: content
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                }
            })

            const data = await saveResponse.json()
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setSubject("")
            setResume("")
        }
    }

    const generateSelect = (e) => {
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
                        generate === 'resume' ?
                            <GenerateResume
                                handleSubmitResume={handleSubmitResume}
                                subject={subject}
                                handleChange={handleChange}
                                resume={resume.info}
                                theme={resume.theme}
                                isLoading={isLoading}
                                handleSaveResume={handleSaveResume}
                                handleCategoryChange={handleCategoryChange}
                                nameCategories={nameCategories}
                            />
                            :
                            <GenerateMentalMap
                                handleSubmitMentalMap={handleSubmitMentalMap}
                                subject={subject}
                                handleChange={handleChange}
                                mentalMap={mentalMap}
                                isLoading={isLoading}
                                handleSaveMentalMap={handleSaveMentalMap}
                                handleCategoryChange={handleCategoryChange}
                                nameCategories={nameCategories}
                            />
                    }
                </>
            }
        />
    )
};
