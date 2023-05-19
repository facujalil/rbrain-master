import React from 'react'
import LoadingGenerateResume from '../skeletonsLoading/LoadingGenerateResume'
import Card from './Card'
import LoadingForm from '../skeletonsLoading/LoadingForm'

export default function GenerateMentalMap(props) {
    return (
        <>
            <form onSubmit={props.handleSubmitMentalMap} className="theme">
                <><p>Theme:</p><input type="text" value={props.subject} onChange={props.handleChange} placeholder="Ej: Básket" />
                    <button className="btn-generate">Generate</button></>
            </form>
            {props.mentalMap.name || props.isLoading ?
                <>
                    <div className="generate-mental-map-container">

                        <div id={props.isLoading ? "generate-resume-loading" : null} className="generate-mental-map">
                            {props.isLoading ?
                                console.log("Loading...")
                                :
                                <Card
                                    showMentalMap={true}
                                    mentalMap={props.mentalMap}
                                />
                            }
                        </div>

                        {props.isLoading ?
                            <LoadingForm />
                            :
                            <form onSubmit={props.handleSaveMentalMap}>
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
