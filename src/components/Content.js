import React, { useState } from "react";
import "../css/Content.css";
import { useNavigate } from "react-router-dom";

function Content(props) {

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
                        {
                            props.selectGridColumns ?
                                <select className="select-grid-columns" onChange={(e) => props.setGridColumns(e.target.value)}>
                                    <option>default</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                </select>
                                :
                                null
                        }
                        {props.register ? <p className="opc-log-in" onClick={() => navigate("/login")}>Iniciar Sesión</p> : null}
                        {props.add ? (<button onClick={props.addCategory} className="btn-add">+</button>) : null}
                    </div>
                    <div className={props.register ? "register-container" : props.login ? "login-container" : props.categories ? "categories-container" : props.flashcards ? "flashcards-container" : props.makeResume ? "make-resume-container" : props.configuration ? "configuration-container" : null}>
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

export default Content;