import { useContext, useEffect, useRef, useState } from "react";
import Content from "./Content";
import AuthContext from "../context/AuthContext";
import EditableCard from "./EditableCard";

export const Profile = () => {

    const refContent = useRef()

    const [modal, setModal] = useState(false)
    const [inputModal, setInputModal] = useState(false)

    useEffect(() => {
        refContent.current.parentNode.id = "profile"
    }, [refContent])

    let [categories, setCategories] = useState([])

    let { authTokens, logoutUser } = useContext(AuthContext)

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
            setCategories(data.categories)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    const addCategory = () => {
        setModal(true)
    }

    const getInputModal = (e) => {
        setInputModal(e.target.value)
    }

    const closeModal = () => {
        setModal(false)
    }

    const addNewCategory = async () => {
        if (inputModal.split(" ").length <= 4 && inputModal.length <= 30) {
            setModal(false)
            try {
                const url = 'https://rbrain.onrender.com/create-category';
                const body = inputModal
                const headers = {
                    'Content-Type': 'text/plain',
                    Authorization: `Bearer ${authTokens.access_token}`
                };
                const response = await fetch(url, { method: 'POST', headers, body });

                if (response.status === 201) {
                    getCategories()
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const deleteCategory = async (categoryId) => {
        try {
            const url = 'https://rbrain.onrender.com/delete-category';
            const body = JSON.stringify(categoryId);
            const headers = {
                'Content-Type': 'text/plain',
                Authorization: `Bearer ${authTokens.access_token}`
            };
            const response = await fetch(url, { method: 'DELETE', headers, body });

            if (response.status === 200) {
                getCategories()
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <>
            {modal ? <> <div onClick={closeModal} className="modal"></div>
                <div className="container-modal-input">
                    <input className="modal-input" onChange={getInputModal} /><button className="btn-modal-input" onClick={addNewCategory}>Add</button>
                </div>
            </>
                : null}

            <Content
                refContent={refContent}
                title="My carpets"
                add={true}
                addCategory={addCategory}
                content={
                    <div className="categories">
                        {categories.map(category => (
                            <div key={category.id} className="category-container">
                                <EditableCard
                                    showCategories={true}
                                    categoryId={category.id}
                                    categoryName={category.name}
                                    deleteCategory={deleteCategory}
                                />
                            </div>
                        ))}
                    </div>
                }
            />
        </>
    )
};