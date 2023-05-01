import React from "react";
import Button from "./Button";
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
                        {props.add ? (<Button href="#" clase="button-add" texto="+" add={true} addCategory={props.addCategory} />) : null}
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
                    <Button href="#" clase="button-upgrade" texto="Upgrade" />
                )
                    : null}
                {
                    props.configuracion ?
                        <Button href="#" clase="button-premium" texto="¡Hazte Premium!" />
                        :
                        null
                }
            </article>
        </section>
    )
}

export default Content;