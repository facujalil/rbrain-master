import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Content from "../components/Content";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [requestCode, setRequestCode] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const [errorRegisterPassword, setErrorRegisterPassword] = useState(false)
    const [errorValidateCode, setErrorValidateCode] = useState(false)

    const sendCodeValidation = async (email, password) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/send-code-validation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': email, 'password': password })
            })

            const data = await response.json()

            if (response.status === 200) {
                setRequestCode(true)
                setErrorRegisterPassword(false)
                setInputValue("")
            } else {
                setErrorRegisterPassword('invalidPassword')
            }
        } catch (error) {
            console.error(error);
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
            sendCodeValidation(value.registerEmail, value.registerFirstPassword)
        }
    }

    const registerUser = async (value) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': email, 'password': password, 'verification_code': value.code })
            })

            const data = await response.json()

            if (response.status === 201) {
                navigate('/login')
                setRequestCode(true)
                setErrorValidateCode(false)
            } else {
                setErrorValidateCode(true)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const leerInput = (e) => {
        console.log(e.target.input)
    }

    return (
        <Content
            refContent={refContent}
            title="Register"
            register={true}
            upgrade={false}
            content={
                requestCode ?
                    <form className="form-validate" onSubmit={handleSubmit(registerUser)}>
                        <label htmlFor="validate">Te hemos enviado un código de verificación al email</label>
                        <input defaultValue={inputValue} className={errorValidateCode ? "error" : null} autoComplete="off" id="validate" placeholder="Ingrese el código" {...register('code', {
                            required: true, value: ""
                        })} />
                        {errorValidateCode ? <div className="container-error"><p>El código ingresado no es correcto</p></div> : null}
                    </form>
                    :
                    <form onSubmit={handleSubmit(registerValidate)}>
                        <label htmlFor="email">Email</label>
                        <input onChange={leerInput} className={errors.registerEmail ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('registerEmail', {
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