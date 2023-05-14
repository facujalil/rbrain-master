import React from 'react';
import "../css/LoadingFlashcard.css";

export default function LoadingFlashcard() {
    return (
        <>
            <div id='flashcard-container-loading' className="flashcard-container">
                <div className='flashcard'>
                    <p className="flashcard-title">Lorem ipsum</p>
                    <div className='flashcard-theme'><p>Lorem</p></div>
                </div >
            </div>
        </>
    )
}