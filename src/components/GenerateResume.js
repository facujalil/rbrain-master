import React from 'react';
import Card from './Card';
import LoadingForm from '../skeletonsLoading/LoadingForm';
import LoadingResume from '../skeletonsLoading/LoadingResume';

export default function GenerateResume(props) {

    return (
        <>
            <form onSubmit={props.handleSubmitResume} className="theme">
                <><p>Theme:</p><input type="text" value={props.subject} onChange={props.handleChange} placeholder="Ej: Fútbol" />
                    <button className="btn-generate">Generate</button></>
            </form>
            {props.resume || props.isLoading ?
                <>
                    <div className="generate-resume-container">

                        <div className={props.isLoading ? "generate-resume generate-resume-loading" : "generate-resume"}>
                            {props.isLoading ?
                                <LoadingResume />
                                :
                                <Card generateResume={true} resume={props.resume} theme={props.theme} />
                            }
                        </div>

                        {props.isLoading ?
                            <LoadingForm />
                            :
                            <form onSubmit={props.handleSaveResume}>
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
