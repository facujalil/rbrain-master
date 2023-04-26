import React from "react";
import "../css/Button.css";

function Button(props) {
    return (
        <button className={props.clase} onClick={props.add ? props.addCategory : null}>{props.texto}</button>
    )
}

export default Button;