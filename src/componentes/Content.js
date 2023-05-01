import React from "react";
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
                        {props.register ? <p className="opc-log-in" onClick={() => navigate("/login")}>Iniciar Sesión</p> : null}
                        {props.add ? (<button onClick={props.addCategory} className="btn-add">+</button>) : null}
                    </div>
                    <div className={props.flashcards ? "flashcards-container" : props.categories ? "categories-container" : "login-container"}>
                        {props.isLoading ? (
                            <p>Cargando...</p>
                        ) : props.errorMsg ? (
                            <p>{props.errorMsg}</p>
                        ) : (
                            props.content
                        )}
                    </div>
                </div>
                {props.upgrade ? (
                    <button className="btn-upgrade">Upgrade</button>
                )
                    : null}
                {
                    props.configuracion ?
                        <button className="btn-premium">¡Hazte Premium!</button>
                        :
                        null
                }
            </article>
        </section>
    )
}

export default Content;