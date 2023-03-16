import React from "react";
import Button from "./Button";
import "../css/Content.css";

function Content(props) {
    return (
        <section className="content" id={props.id}>
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
                        {props.add ? (<Button href="#" clase="button-add" texto="+" />) : null}
                    </div>
                    <div className={props.flashcards ? "flashcards-container" : props.categories ? "categories-container" : "login-container"}>
                        {props.isLoading ? (
                            <p>Cargando...</p>
                        ) : props.errorMsg ? (
                            <p>{props.errorMsg}</p>
                        ) : (
                            props.contenido
                        )}
                    </div>
                </div>
                {props.upgrade ? (
                    <Button href="#" clase="button-upgrade" texto="Upgrade" />
                )
                    : null}
            </article>
        </section>
    )
}

export default Content;