import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";

export default function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const [stateForgotPassword, setStateForgotPassword] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const { loginUser, errorLoginApi } = useContext(AuthContext)

    const forgetPassword = () => {
        setStateForgotPassword(false)
        setEmailSent(true)
    }

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
                !stateForgotPassword && !emailSent ?
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
                        <p className="opc-fotgotten-password" onClick={() => setStateForgotPassword(true)}>Olvidé mi contraseña</p>
                    </form>
                    :
                    emailSent ?
                        <form>
                            <p>¡Listo! Te hemos enviado un correo para que restablezcas tu contraseña.</p>
                            <input className={errors.loginPassword || errorLoginApi ? "error" : null} type="password" name="password" placeholder="New password" {...register('loginPassword', { required: true })} />
                            <input className={errors.loginPassword || errorLoginApi ? "error" : null} type="password" name="password" placeholder="Confirm new password" {...register('loginPassword', { required: true })} />
                        {
                            errors.loginPassword && !errorLoginApi ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
                        }
                        {
                            errorLoginApi ? <div className="container-error"><p>El email y/o la contraseña son incorrectos</p></div> : null
                        }
                        <input id="submit" type="submit" value="Siguiente" />
                        </form>
                        :
                        <form onSubmit={handleSubmit(forgetPassword)}>
                            <label htmlFor="email">Introduce tu correo electrónico para restablecer tu contraseña</label>
                            <input className={errors.loginEmail || errorLoginApi ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('loginEmail', {
                                required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                            })} />
                            {
                                errors.loginEmail && !errorLoginApi ? <div className="container-error"><p>Ingresa un email</p></div> : null
                            }
                            <input id="submit" type="submit" value="Siguiente" />
                        </form>
            }
        />
    )
};