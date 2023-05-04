import { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";

export default function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { loginUser, errorLoginApi } = useContext(AuthContext)

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "login"
    }, [refContent])

    return (
        <Content
            refContent={refContent}
            title="Login"
            login={true}
            upgrade={false}
            content={
                <form onSubmit={handleSubmit(loginUser)}>
                    <label htmlFor="email">Email</label>
                    <input className={errors.loginEmail || errorLoginApi ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('loginEmail', {
                        required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                    })} />
                    {
                        errors.loginEmail && !errorLoginApi ? <div className="container-error"><p>Ingresa un email</p></div> : null
                    }
                    <label htmlFor="password">Contraseña</label>
                    <input className={errors.loginPassword || errorLoginApi ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('loginPassword', { required: true })} />
                    {
                        errors.loginPassword && !errorLoginApi ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
                    }
                    {
                        errorLoginApi ? <div className="container-error"><p>El email y/o la contraseña son incorrectos</p></div> : null
                    }
                    <input id="submit" type="submit" value="Iniciar Sesión" />
                    <p className="opc-fotgotten-password">Olvidé mi contraseña</p>
                </form>
            }
        />
    )
};