import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Content from "./Content";

export const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [requestCode, setRequestCode] = useState(false)

    const [errorRegisterPassword, setErrorRegisterPassword] = useState(false)

    const registerUser = async (email, contraseña) => {
        let response = await fetch('https://rbrain.onrender.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': contraseña })
        })
        let data = await response.json()
        if (response.status !== 201) {
            setRequestCode(true)
        } else {
            setErrorRegisterPassword('invalidPassword')
        }
    }

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "register"
    }, [refContent])

    const registerValidate = (value) => {
        if (value.registerFirstPassword !== value.registerSecondPassword) {
            setErrorRegisterPassword('unequalPasswords')
        }
        else {
            setErrorRegisterPassword(false)
            setEmail(value.registerEmail)
            setPassword(value.registerFirstPassword)
            registerUser(value.registerEmail, value.registerFirstPassword)
        }
    }

    const validateCode = (value) => {
        console.log(email, password, value.code)
    }

    return (
        <Content
            refContent={refContent}
            title="Register"
            register={true}
            upgrade={false}
            content={
                requestCode ?
                    <form className="form-validate" onSubmit={handleSubmit(validateCode)}>
                        <label htmlFor="validate">Te hemos enviado un código de verificación al email</label>
                        <input type="number" id="validate" placeholder="Ingrese el código" {...register('code', {
                            required: true
                        })} />
                    </form>
                    :
                    <form onSubmit={handleSubmit(registerValidate)}>
                        <label htmlFor="email">Email</label>
                        <input className={errors.registerEmail ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('registerEmail', {
                            required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                        })} />
                        {
                            errors.registerEmail ? <div className="container-error"><p>Ingresa un email</p></div> : null
                        }
                        <label htmlFor="password">Contraseña</label>
                        <input className={errors.registerFirstPassword || errorRegisterPassword ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('registerFirstPassword', { required: true })} />
                        {
                            errors.registerFirstPassword && !errorRegisterPassword ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
                        }
                        <label htmlFor="password">Contraseña</label>
                        <input className={errors.registerSecondPassword || errorRegisterPassword ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('registerSecondPassword', { required: true })} />
                        {
                            errors.registerSecondPassword && !errorRegisterPassword ? <div className="container-error"><p>Ingresa una contraseña</p></div> : null
                        }
                        {
                            errorRegisterPassword === 'invalidPassword' ? <div className="container-error"><p>La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un dígito</p></div> : errorRegisterPassword === 'unequalPasswords' ? <div className="container-error"><p>Las contraseñas no coinciden</p></div> : null
                        }
                        <input id="submit" type="submit" value="Register" />
                    </form>
            }
        />
    )
};