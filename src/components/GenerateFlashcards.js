import React from 'react'
import LoadingGenerateFlashcards from '../skeletonsLoading/LoadingGenerateFlashcards'
import Card from './Card'
import LoadingForm from '../skeletonsLoading/LoadingForm'

export default function GenerateFlashcards(props) {
    return (
        <>
            <form onSubmit={props.handleSubmitFlashcards} className="theme">
                <><p>Theme:</p><input type="text" value={props.subject} onChange={props.handleChange} placeholder="Ej: Descubrimientos de Einstein" />
                    <button className="btn-generate">Generate</button></>
            </form>
            {props.response || props.isLoading ?
                <>
                    <div className="generate-flashcards-container">

                        <div id={props.isLoading ? "generate-flashcards-loading" : null} className="generate-flashcards">
                            {props.isLoading ?
                                <LoadingGenerateFlashcards />
                                :
                                props.response.lista_flashcards.map((card) => (
                                    <Card
                                        key={card.title}
                                        title={card.title}
                                        info={card.info}
                                        theme={props.response.theme}
                                    />
                                ))

                            }
                        </div>

                        {props.isLoading ?
                            <LoadingForm />
                            :
                            <form onSubmit={props.handleSave}>
                                <>
                                    <select defaultValue='DEFAULT' onChange={props.handleCategoryChange}>
                                        <option value="DEFAULT" disabled hidden>Categories</option>
                                        {props.nameCategories.map(category => <option key={category}>{category}</option>)} </select>
                                    <button className="btn-save" type="submit">Save</button>
                                </>
                            </form>
                        }

                    </div>
                </>
                :
                null
            }
        </>
    )
}
