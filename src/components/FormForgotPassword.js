import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import AuthContext from '../context/AuthContext'

export default function FormForgotPassword(props) {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { errorLoginApi } = useContext(AuthContext)

    const forgotPassword = async (value) => {

        try {
            const response = await fetch('https://rbrain.onrender.com/forgot-password', {
                method: 'POST',
                body: value.emailForgotPassword
                ,
                headers: {
                    'Content-Type': 'text/plain'
                }
            })

            const data = await response.json()
        }
        catch (error) {
            console.error(error)
        }
        finally {
            props.setStateForgotPassword(false)
            props.setEmailSent(true)
        }
    }

    return (
        <form onSubmit={handleSubmit(forgotPassword)}>
            <label htmlFor="email">Introduce tu correo electrónico para restablecer tu contraseña</label>
            <input className={errors.emailForgotPassword ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('emailForgotPassword', {
                required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            })} />
            {
                errors.emailForgotPassword ? <div className="container-error"><p>Ingresa un email</p></div> : null
            }
            <input id="submit" type="submit" value="Siguiente" />
        </form>
    )
}
