import { useContext, useEffect, useRef } from "react";
import Content from "./Content";
import AuthContext from "../context/AuthContext";
import { useForm } from "react-hook-form";

export const Configuration = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    let { loginUser } = useContext(AuthContext)

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "configuration"
    }, [refContent])

    return (
        <Content
            refContent={refContent}
            title="Configuration"
            configuration={true}
            flashcards={true}
            add={false}
            content={
                <>
                    <form onSubmit={handleSubmit(loginUser)}>
                        <label htmlFor="email">Cambiar email</label>
                        <input className={errors.configurationEmail ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('configurationEmail', {
                            required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                        })} />
                        {
                            errors.configurationEmail ? <div className="container-error"><p>Ingresa un email</p></div> : null
                        }
                        <label htmlFor="password">Cambiar contraseña</label>
                        <input className={errors.configurationPassword ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('configurationPassword', { required: true })} />
                        {
                            errors.configurationPassword ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
                        }
                        <div className="container-buttons">
                            <button className="info-pay">Tu información de pago</button>
                            <button className="logout">Logout</button>
                        </div>
                    </form>
                    <p className="status">Status: free</p>
                </>
            }
        />
    )
};