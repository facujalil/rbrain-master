import React from 'react';
import { useForm } from 'react-hook-form';

export default function FormChangePassword(props) {

    const { register, handleSubmit, formState: { errors } } = useForm()

return (
        <form className="form-send-code-validation" onSubmit={handleSubmit(props.changePassword)}>
            <label htmlFor="email">Change password</label>
            <input className={errors.configurationNewEmail ? "error" : null} type="password" name="password" placeholder="Ingresa su contraseña actual" {...register('configurationActualPassword', {
                required: true, value: ""
            })} />
            {
                errors.configurationNewEmail ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
            }
            <input className={errors.configurationPassword ? "error" : null} type="password" name="password" placeholder="Ingresa su nueva contraseña" {...register('configurationNewPassword', { required: true, value: "" })} />
            {
                errors.configurationPassword ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
            }
            <button className="change" type="submit">Change</button>
        </form>
    )
}
