import React from "react";
import "../css/Content.css";
import { useNavigate } from "react-router-dom";

export default function Content(props) {

    const navigate = useNavigate()

    return (
        <section ref={props.refContent} className="content">
            <div className="content-header">
                <h1>My robot brain</h1>
                {/*<div className="night-mode"></div>*/}
            </div>
            <article className="content-principal-container">
                <div className="content-principal">
                    <div className="content-principal-header">
                        <div className="circle-and-title">
                            <div className="circle"></div>
                            <h4>{props.title}</h4>
                        </div>
                        {props.generateFlashcards ? <select className="select-generate" onChange={props.generateSelect}> <option>flashcards</option> <option>resume</option> <option>mental map</option> </select> : null}
                        {
                            props.selectTypeCarpet ?
                                <select className="select-type-carpet" onChange={props.getTypeCarpet}>
                                    <option>flashcards</option>
                                    <option>resume</option>
                                    <option>mental map</option>
                                </select>
                                :
                                null
                        }

                        {
                            props.selectGridColumns ?
                                <select defaultValue='DEFAULT' className="select-grid-columns" onChange={(e) => { localStorage.setItem('gridColumns', e.target.value !== 'default' ? Number(e.target.value) : e.target.value); props.setGridColumns(e.target.value) }}>
                                    <option value={localStorage.gridColumns === "default" ? "DEFAULT" : null}>default</option>
                                    <option value={Number(localStorage.gridColumns) === 1 ? "DEFAULT" : null}>1</option>
                                    <option value={Number(localStorage.gridColumns) === 2 ? "DEFAULT" : null}>2</option>
                                    <option value={Number(localStorage.gridColumns) === 3 ? "DEFAULT" : null}>3</option>
                                    <option value={Number(localStorage.gridColumns) === 4 ? "DEFAULT" : null}>4</option>
                                </select>
                                :
                                null
                        }
                        {props.register ? <p className="opc-log-in" onClick={() => navigate("/login")}>Iniciar Sesión</p> : null}
                        {props.add ? (<button onClick={props.addCategory} className="btn-add">+</button>) : null}
                    </div>
                    <div className={props.register ? "register-container" : props.login ? "login-container" : props.categories ? "categories-container" : props.carpet ? "carpet-container" : props.generate ? "generate-container" : props.makeResume ? "make-resume-container" : props.configuration ? "configuration-container" : null}>
                        {
                            props.content
                        }
                    </div>
                </div>
                {props.upgrade ? (
                    <button className="btn-upgrade">Upgrade</button>
                )
                    : null}
                {
                    props.btnConfiguration ?
                        <button className="btn-premium">¡Hazte Premium!</button>
                        :
                        null
                }
            </article>
        </section>
    )
}
