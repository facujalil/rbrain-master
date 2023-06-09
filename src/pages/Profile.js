import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import Card from "../components/Card";
import LoadingCategory from "../skeletonsLoading/LoadingCategory";

export default function Profile() {

    const refContent = useRef()

    const [modal, setModal] = useState(false)
    const [inputModal, setInputModal] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isNewCategoryLoading, setIsNewCategoryLoading] = useState(false)
    const loading = []

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
            setIsNewCategoryLoading(false)
        }
    }

    const addCategory = () => {
        setInputModal("")
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
    }

    const addNewCategory = async (e) => {
        e.preventDefault()
        if (inputModal) {
            setModal(false)
            setIsNewCategoryLoading(true)
            try {
                const response = await fetch('https://rbrain.onrender.com/create-category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.access_token}`
                    },
                    body: JSON.stringify({ category: inputModal })
                })

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

            const response = await fetch('https://rbrain.onrender.com/delete-category', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                },
                body: JSON.stringify(categoryId)
            })

            if (response.status === 200) {
                getCategories()
            }
        } catch (error) {
            console.error(error);
        }
    }

    for (let i = 0; i < 8; i++) {
        loading.push(<LoadingCategory key={i} />)
    }

    return (
        <>
            {modal ? <> <div onClick={closeModal} className="modal"></div>
                <div className="container-form-modal">
                    <form className="form-modal">
                        <label>Add new carpet</label>
                        <input value={inputModal} className="modal-input" onChange={(e) => e.target.value.split(" ").length <= 4 && e.target.value.length <= 30 ? setInputModal(e.target.value) : null} placeholder="Carpet name" /><button className="btn-modal" onClick={addNewCategory}>Add</button>
                    </form>
                </div>
            </>
                : null}
            <Content
                refContent={refContent}
                title="My carpets"
                categories={true}
                add={true}
                addElement={addCategory}
                content={
                    <div id={isLoading ? "categories-loading" : null} className="categories">
                        {isLoading ?
                            <>
                                {loading}
                            </>
                            :
                            categories.length > 0 ?
                                categories.map(category => (
                                    <div key={category.id} className="category-container">
                                        <Card
                                            showCategories={true}
                                            categoryId={category.id}
                                            categoryName={category.name}
                                            deleteCategory={deleteCategory}
                                        />
                                    </div>
                                ))
                                :
                                !isNewCategoryLoading ?
                                    <p className="msg-error">No se encontraron categories</p>
                                    :
                                    null
                        }
                        {
                            isNewCategoryLoading ?
                                <LoadingCategory />
                                :
                                null
                        }
                    </div>
                }
            />
        </>
    )
};
