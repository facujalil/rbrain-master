import React from 'react';
import "../css/LoadingForm.css";

export default function LoadingForm() {
    return (
        <form id="form-loading" onSubmit={(e) => e.preventDefault()}>
            <>
                <select disabled>
                    <option value="DEFAULT" disabled hidden>Lorem ipsum</option>
                </select>
                <button className="btn-save"></button>
            </>
        </form>
    )
}