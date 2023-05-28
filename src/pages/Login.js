import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Content from "../components/Content";
import FormLoginUser from "../components/FormLoginUser";
import FormForgotPassword from "../components/FormForgotPassword";

export default function Login(props) {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const [stateForgotPassword, setStateForgotPassword] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

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

                !props.showResetPassword ?

                    !stateForgotPassword && !emailSent ?

                        <FormLoginUser
                            setStateForgotPassword={setStateForgotPassword}
                        />

                        :

                        !emailSent ?

                            <FormForgotPassword
                                setStateForgotPassword={setStateForgotPassword}
                                setEmailSent={setEmailSent}
                            />

                            :

                            <form>
                                <p>¡Listo! Te hemos enviado un correo para que restablezcas tu contraseña.</p>
                            </form>

                    :

                    <form onSubmit={handleSubmit(props.resetPassword)}>
                        <label>Introduce tu nueva contraseña</label>
                        <input className={errors.firstPassword || props.errorResetPassword || props.unequalPasswords ? "error" : null} type="password" name="password" placeholder="New password" {...register('firstPassword', { required: true })} />
                        <input className={errors.secondPassword || props.errorResetPassword || props.unequalPasswords ? "error" : null} type="password" name="password" placeholder="Confirm new password" {...register('secondPassword', { required: true })} />
                        {
                            errors.firstPassword ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
                        }
                        {
                            props.errorResetPassword ? <div className="container-error"><p>La contraseña no es válida</p></div> : null
                        }
                        {
                            props.unequalPasswords ? <div className="container-error"><p>Las contraseñas no coinciden</p></div> : null
                        }
                        <input id="submit" type="submit" value="Siguiente" />
                    </form>

            }
        />
    )
};