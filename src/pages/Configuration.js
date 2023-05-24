import { useContext, useEffect, useRef, useState } from "react";
import Content from "../components/Content";
import AuthContext from "../context/AuthContext";
import FormSendCodeValidation from "../components/FormSendCodeValidation";
import FormChangeEmail from "../components/FormChangeEmail";
import FormChangePassword from "../components/FormChangePassword";

export default function Configuration() {

    const { logoutUser, authTokens } = useContext(AuthContext)

    const [requestCode, setRequestCode] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [password, setPassword] = useState("")

    const refContent = useRef()

    useEffect(() => {
        refContent.current.parentNode.id = "configuration"
    }, [refContent])

    const sendCodeValidation = async (value) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/send-code-validation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': value.configurationNewEmail, 'password': value.configurationPassword })
            })

            const data = await response.json()

            if (response.status === 200) {
                setRequestCode(true)
                setNewEmail(value.configurationNewEmail)
                setPassword(value.configurationPassword)
            } else {
                console.log("error:", data.detail);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const changeEmail = async (value) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/change-mail', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                },
                body: JSON.stringify({ 'new_email': newEmail, 'password': password, 'verification_code': value.validateCode })
            })

            const data = await response.json()

            if (response.status === 202) {
                logoutUser()
            } else {
                console.log("error:", data.detail);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const changePassword = async (value) => {
        try {
            const response = await fetch('https://rbrain.onrender.com/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access_token
                },
                body: JSON.stringify({ 'password': value.configurationActualPassword, 'new_password': value.configurationNewPassword })
            })

            const data = await response.json()

            if (response.status === 202) {
                logoutUser()
            } else {
                console.log("error:", data.detail);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const closeModal = () => {
        setRequestCode(false)
    }

    return (

        <>
            {requestCode ? <> <div onClick={closeModal} className="modal"></div>
                <div className="container-form-modal">
                    <FormChangeEmail changeEmail={changeEmail} />
                </div>
            </>
                : null}
            <Content
                refContent={refContent}
                title="Configuration"
                upgrade={true}
                configuration={true}
                add={false}
                content={
                    <>
                        <div className="configuration-container-forms">

                            <FormSendCodeValidation sendCodeValidation={sendCodeValidation} />

                            <FormChangePassword changePassword={changePassword} />


                            <div className="container-buttons">
                                <button className="info-pay">Tu información de pago</button>
                                <button onClick={logoutUser} className="logout">Logout</button>
                            </div>

                        </div>
                        {/*<p className="status">Status: free</p>*/}
                    </>
                }
            />
        </>
    )
};