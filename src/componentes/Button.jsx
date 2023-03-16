import React from "react";
import "../css/Button.css";

function Button(props) {
    return (
        <button className={props.clase}>{props.texto}</button>
    )
}

export default Button;