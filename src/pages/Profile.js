import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import EditableCard from "../components/EditableCard";
import LoadingCategories from "../skeletonsLoading/LoadingCategories";

export const Profile = () => {

    const refContent = useRef()

    const [modal, setModal] = useState(false)
    const [inputModal, setInputModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        refContent.current.parentNode.id = "profile"
    }, [refContent])

    const [categories, setCategories] = useState([])

    const { authTokens, logoutUser } = useContext(AuthContext)

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
                setCategories(data.categories)
            } else if (response.statusText === 'Unauthorized') {
                logoutUser()
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false)
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
                <div className="container-form-modal">
                    <form className="form-modal">
                        <label>Add new carpet</label>
                        <input className="modal-input" onChange={getInputModal} placeholder="Carpet name" /><button className="btn-modal-input" onClick={addNewCategory}>Add</button>
                    </form>
                </div>
            </>
                : null}
            <Content
                refContent={refContent}
                title="My carpets"
                categories={true}
                add={true}
                addCategory={addCategory}
                content={
                    <div id={isLoading ? "categories-loading" : null} className="categories">
                        {isLoading ?
                            <LoadingCategories />
                            :
                            categories.map(category => (
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