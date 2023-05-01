import { useContext, useEffect, useRef, useState } from "react";
import Content from "./Content";
import AuthContext from "../context/AuthContext";
import EditableCard from "./EditableCard";

export const GenerateFlashcards = () => {
    let { authTokens } = useContext(AuthContext);
    const [subject, setSubject] = useState('');
    const [response, setResponse] = useState(null);
    const [category, setCategory] = useState('');
    const [nameCategories, setNameCategories] = useState("")

    useEffect(() => {
        getCategories()
    }, [])

    let getCategories = async () => {
        let response = await fetch('https://rbrain.onrender.com/get-categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access_token
            }
        })

        let data = await response.json()


        if (response.status === 200) {
            setNameCategories(data.categories.map(category => category.name))
        }
    }

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "generate-flashcards"
    }, [refContent])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (subject.split(" ").length <= 4 && subject.length <= 30) {
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
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleChange = (e) => {
        setSubject(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
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

    return (
        <Content
            refContent={refContent}
            title={"Generate flashcards"}
            flashcards={true}
            content={
                <>
                    <form onSubmit={handleSubmit} className="theme">
                        <p>Theme:</p><input type="text" value={subject} onChange={handleChange} placeholder="Ej: Descubrimientos de Einstein" /><button className="btn-generate">Generate</button>
                    </form>
                    {response && (
                        <>
                            <div className="generate-flashcards-container">
                                <div className="generate-flashcards">
                                    {response.lista_flashcards.map((card) => (
                                        <EditableCard
                                            key={card.title}
                                            title={card.title}
                                            info={card.info}
                                            theme={response.theme}
                                        />
                                    ))}
                                </div>
                                <form onSubmit={handleSave}>
                                    <select defaultValue='DEFAULT' onChange={handleCategoryChange}>
                                        <option value="DEFAULT" disabled hidden>Select an option</option>
                                        {nameCategories.map(category => <option key={category}>{category}</option>)} </select>
                                    <button className="btn-save" type="submit">Save</button>
                                </form>
                            </div>
                        </>
                    )
                    }
                </>
            }
        />
    )
};