import React, { useRef, useState } from 'react'
import LoadingGenerateResume from '../skeletonsLoading/LoadingGenerateResume'
import Card from './Card'
import LoadingForm from '../skeletonsLoading/LoadingForm'

export default function GenerateMentalMap(props) {

    const [isDragging, setIsDragging] = useState(false);
    const [mouseDownX, setMouseDownX] = useState(0);
    const [mouseDownY, setMouseDownY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const scrollableDivRef = useRef();
    const containerRef = useRef();
    const refMentalMap = useRef()

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

    let scale = 1;

    const zoom = (event) => {

        const scrollDelta = Math.sign(event.deltaY);
        const zoomStep = 0.1; // Ajusta el valor para controlar el nivel de zoom

        if (scrollDelta > 0) {
            scale -= zoomStep; // Zoom out
        } else {
            scale += zoomStep; // Zoom in
        }

        scale = Math.min(Math.max(0.5, scale), 3); // Limita el nivel de zoom entre 0.5 y 3

        refMentalMap.current.style.transform = `scale(${scale})`;
    }

    return (
        <>
            <form onSubmit={props.handleSubmitMentalMap} className="theme">
                <><p>Theme:</p><input type="text" value={props.subject} onChange={props.handleChange} placeholder="Ej: Básket" />
                    <button className="btn-generate">Generate</button></>
            </form>
            {props.mentalMap.info || props.isLoading ?
                <>
                    <div className="generate-mental-map-container"
                        ref={containerRef}
                        style={props.mentalMap ? { overflow: 'hidden' } : null}
                        onMouseLeave={handleMouseLeave}
                        onTouchEnd={handleTouchEnd}
                    >

                        <div id={props.isLoading ? "generate-resume-loading" : null} className="generate-mental-map"
                            ref={scrollableDivRef}
                            style={props.mentalMap ? {
                                overflow: 'hidden',
                                cursor: 'grab'
                            } : null}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                        >
                            {props.isLoading ?
                                console.log("Loading...")
                                :
                                <div ref={refMentalMap} onWheel={(event) => zoom(event)} className={"container-zoom-mental-map"}>
                                    <Card
                                        showMentalMap={true}
                                        mentalMap={props.mentalMap}
                                    />
                                </div>
                            }
                        </div>

                        {props.isLoading ?
                            <LoadingForm />
                            :
                            <form onSubmit={props.handleSaveMentalMap}>
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
