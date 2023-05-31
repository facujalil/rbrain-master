import React, { useContext, useRef, useState } from "react";
import "../css/Content.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Content(props) {

    const navigate = useNavigate()

    const { authTokens } = useContext(AuthContext);
    const [isDragging, setIsDragging] = useState(false);
    const [mouseDownX, setMouseDownX] = useState(0);
    const [mouseDownY, setMouseDownY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const scrollableDivRef = useRef();
    const containerRef = useRef();

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setMouseDownX(e.touches ? e.touches[0].pageX : e.pageX);
        setMouseDownY(e.touches ? e.touches[0].pageY : e.pageY);
        setScrollLeft(scrollableDivRef.current.scrollLeft);
        setScrollTop(scrollableDivRef.current.scrollTop);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const mouseMoveX = e.touches ? e.touches[0].pageX : e.pageX;
            const mouseMoveY = e.touches ? e.touches[0].pageY : e.pageY;
            const scrollAmountX = mouseDownX - mouseMoveX;
            const scrollAmountY = mouseDownY - mouseMoveY;
            scrollableDivRef.current.scrollLeft = scrollLeft + scrollAmountX;
            scrollableDivRef.current.scrollTop = scrollTop + scrollAmountY;
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const upgrade = async () => {
        try {

            const response = await fetch('https://rbrain.onrender.com/subscription/payment', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                }
            })

            const data = await response.json();

            window.open(data.link);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section ref={props.refContent} className="content">
            <div className="content-header">
                <h1>My robot brain</h1>
                {/*<div className="night-mode"></div>*/}
            </div>
            <article className="content-principal-container">
                <div className="content-principal" ref={props.mentalMap ? containerRef : null}
                    style={props.mentalMap ? { overflow: 'hidden' } : null}
                    onMouseLeave={props.mentalMap ? handleMouseLeave : null}
                    onTouchEnd={props.mentalMap ? handleTouchEnd : null}>
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
                        {props.add ? (<button onClick={props.addElement} className="btn-add">+</button>) : null}
                    </div>
                    <div

                        ref={props.mentalMap ? scrollableDivRef : null}
                        style={props.mentalMap ? {
                            overflow: 'hidden',
                            cursor: 'grab'
                        } : null}
                        onMouseDown={props.mentalMap ? handleMouseDown : null}
                        onMouseUp={props.mentalMap ? handleMouseUp : null}
                        onMouseMove={props.mentalMap ? handleMouseMove : null}
                        onTouchStart={props.mentalMap ? handleMouseDown : null}
                        onTouchMove={props.mentalMap ? handleMouseMove : null}

                        className={props.register ? "register-container" : props.login ? "login-container" : props.categories ? "categories-container" : props.carpet ? "carpet-container" : props.generate ? "generate-container" : props.makeResume ? "make-resume-container" : props.configuration ? "configuration-container" : null}>
                        {
                            props.content
                        }
                    </div>
                </div>
                {props.upgrade ? (
                    <button className="btn-upgrade" onClick={() => upgrade()}>Upgrade</button>
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
