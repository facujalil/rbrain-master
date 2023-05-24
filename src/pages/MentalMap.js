import React, { useContext, useEffect, useRef, useState } from 'react';
import '../css/MentalMap.css';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Card from '../components/Card';
import Content from '../components/Content';

export default function MentalMap() {

    const refContent = useRef();
    const refMentalMap = useRef()
    const { categoryCardMentalMapId } = useParams();
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [mentalMap, setMentalMap] = useState([])

    useEffect(() => {
        refContent.current.lastChild.firstChild.lastChild.className = "carpet-container-mental-map"
    }, [])

    useEffect(() => {
        getMentalMap()
    }, [categoryCardMentalMapId, authTokens, logoutUser]);

    const getMentalMap = async () => {
        try {
            const response = await fetch(`https://rbrain.onrender.com/mental-map/${parseInt(categoryCardMentalMapId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access_token}`
                }
            })

            const data = await response.json();

            if (response.status === 200) {
                setMentalMap(data.mental_map)
            }
        } catch (error) {
            console.error(error);
        }
    }

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
        <Content
            refContent={refContent}
            title={mentalMap.info}
            carpet={true}
            mentalMap={true}
            selectTypeCarpet={false}
            content={
                <div ref={refMentalMap} onWheel={(event) => zoom(event)} className={"container-zoom-mental-map"}>
                    <Card
                        showMentalMap={true}
                        mentalMap={mentalMap}
                    />
                </div >
            }
        />
    )
}
