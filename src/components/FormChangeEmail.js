import React from 'react';
import { useForm } from 'react-hook-form';

export default function FormChangeEmail(props) {

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <form className='form-modal' onSubmit={handleSubmit(props.changeEmail)}>
            <label>Enter the code</label>
            <input className="modal-input" {...register('validateCode', { required: true, value: "" })} placeholder='Code' /><button className="btn-modal-input">Send</button>
        </form>
    )
}