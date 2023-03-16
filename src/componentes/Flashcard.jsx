import React from "react";
import "../css/Flashcard.css";

function Flashcard(props) {

    return (
        <div className="flashcard">
            <p className="flashcard-title">{props.title}</p>
            {props.mostrarTheme ? <p className="flashcard-theme">{props.theme}</p> : null}
            {/*<p>{props.info}</p>*/}
        </div>
    )

}

export default Flashcard;