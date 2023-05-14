import React from 'react';
import { useForm } from 'react-hook-form';

export default function FormSendCodeValidation(props) {

    const { register, handleSubmit, formState: { errors } } = useForm()

    return (
        <form className="form-send-code-validation" onSubmit={handleSubmit(props.sendCodeValidation)}>
            <label htmlFor="email">Change email</label>
            <input className={errors.configurationNewEmail ? "error" : null} type="text" name="email" placeholder="Ingresa su nuevo email" {...register('configurationNewEmail', {
                required: true, value: "", pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            })} />
            {
                errors.configurationNewEmail ? <div className="container-error"><p>Ingresa un email</p></div> : null
            }
            <input className={errors.configurationPassword ? "error" : null} type="password" name="password" placeholder="Ingresa su contraseña actual" {...register('configurationPassword', { required: true, value: "" })} />
            {
                errors.configurationPassword ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
            }
            <button className="change" type="submit">Change</button>
        </form>
    )
}