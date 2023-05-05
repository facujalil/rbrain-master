import React from 'react';
import Card from './Card';

export default function GenerateResume(props) {

    return (
        <>
            <form onSubmit={props.handleSubmitResume} className="theme">
                <><p>Theme:</p><input type="text" value={props.subject} onChange={props.handleChange} placeholder="Ej: Fútbol" />
                    <button className="btn-generate">Generate</button></>
            </form>
            {props.response || props.isLoading ?
                <>
                    <div className="generate-resume-container">

                        <div id={props.isLoading ? "generate-resume-loading" : null} className="generate-resume">
                            {props.isLoading ?
                                <p>Loading...</p>
                                :
                                <Card generateResume={true} response={props.response} />
                            }
                        </div>

                        {props.isLoading ?
                            <p>Loading...</p>
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
