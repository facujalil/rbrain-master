import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Content from "../componentes/Content";
import EditableCard from "../componentes/EditableCard";
import Button from "../componentes/Button";
import { useForm } from "react-hook-form";

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

export const Login = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()

  let { loginUser, errorLoginApi } = useContext(AuthContext)

  const refContent = useRef()

  useEffect(() => {
    refContent.current.parentNode.id = "login"
  }, [refContent])

  return (
    <Content
      refContent={refContent}
      title="Login"
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

export const Profile = () => {

  const refContent = useRef()

  const [modal, setModal] = useState(false)
  const [inputModal, setInputModal] = useState(false)

  useEffect(() => {
    refContent.current.parentNode.id = "profile"
  }, [refContent])

  let [categories, setCategories] = useState([])

  let { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {
    getCategories()
  }, [])

  let getCategories = async () => {
    let response = await fetch('https://rbrain.onrender.com/get-categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access_token
      }
    })

    let data = await response.json()

    if (response.status === 200) {
      setCategories(data.categories)
    } else if (response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  const addCategory = () => {
    setModal(true)
  }

  const getInputModal = (e) => {
    setInputModal(e.target.value)
  }

  const closeModal = () => {
    setModal(false)
  }

  const addNewCategory = async () => {
    if (inputModal.split(" ").length <= 4 && inputModal.length <= 30) {
      setModal(false)
      try {
        const url = 'https://rbrain.onrender.com/create-category';
        const body = inputModal
        const headers = {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${authTokens.access_token}`
        };
        const response = await fetch(url, { method: 'POST', headers, body });

        if (response.status === 201) {
          getCategories()
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const url = 'https://rbrain.onrender.com/delete-category';
      const body = JSON.stringify(categoryId);
      const headers = {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${authTokens.access_token}`
      };
      const response = await fetch(url, { method: 'DELETE', headers, body });

      if (response.status === 200) {
        getCategories()
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (

    <>
      {modal ? <> <div onClick={closeModal} className="modal"></div>
        <div className="container-modal-input">
          <input className="modal-input" onChange={getInputModal} /><button className="btn-modal-input" onClick={addNewCategory}>Add</button>
        </div>
      </>
        : null}

      <Content
        refContent={refContent}
        title="My carpets"
        add={true}
        addCategory={addCategory}
        content={
          <div className="categories">
            {categories.map(category => (
              <div key={category.id} className="category-container">
                <EditableCard
                  showCategories={true}
                  categoryId={category.id}
                  categoryName={category.name}
                  deleteCategory={deleteCategory}
                />
              </div>
            ))}
          </div>
        }
      />
    </>
  )
};

export const Category = () => {
  const { categoryId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCategoryFlashcards, setCurrentCategoryFlashcards] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getFlashcards();
  }, [categoryId, authTokens, logoutUser]);

  const getFlashcards = async () => {
    try {
      const url = `https://rbrain.onrender.com/get-flashcards-by-category?category=${parseInt(categoryId)}`;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens.access_token}`,
      };
      const options = {
        method: 'GET',
        headers: headers,
      };
      const response = await fetch(url, options);

      const data = await response.json();

      if (response.status === 200 && data.msg === 'ok') {
        setCurrentCategoryFlashcards(data.category)
        if (data.flashcards.length > 0) {
          setFlashcards(data.flashcards);
        }
        else {
          const errorMsg = 'No se encontraron flashcards';
          setErrorMsg(errorMsg);
        }
      } else {
        const errorMsg = 'No hay categorías existentes';
        setErrorMsg(errorMsg);
      }
    } catch (error) {
      setErrorMsg(`Ha ocurrido un error al buscar flashcards: ${error}`);
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showTitle = () => {
    if (currentCategoryFlashcards.length > 0) {
      const title = currentCategoryFlashcards[0].toUpperCase() + currentCategoryFlashcards.slice(1)
      return `My carpet ${title}`
    }
  }

  const deleteFlashcard = async (flashcardId) => {
    try {
      const url = 'https://rbrain.onrender.com/delete-flashcard';
      const body = JSON.stringify(flashcardId);
      const headers = {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${authTokens.access_token}`
      };
      const response = await fetch(url, { method: 'DELETE', headers, body });

      if (response.status === 200) {
        getFlashcards()
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Content
        title={showTitle()}
        flashcards={true}
        isLoading={isLoading}
        errorMsg={errorMsg}
        content={
          <div className="flashcards">
            {flashcards.map((flashcard) => (
              <EditableCard
                showFlashcards={true}
                deleteFlashcard={deleteFlashcard}
                key={flashcard.id}
                flashcardId={flashcard.id}
                title={flashcard.title}
                info={flashcard.info}
                theme={flashcard.theme}
              />
            ))}
          </div>
        }
      />
    </>
  )
};

export const GenerateFlashcards = () => {
  let { authTokens } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [response, setResponse] = useState(null);
  const [category, setCategory] = useState('');
  const [nameCategories, setNameCategories] = useState("")

  useEffect(() => {
    getCategories()
  }, [])

  let getCategories = async () => {
    let response = await fetch('https://rbrain.onrender.com/get-categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens.access_token
      }
    })

    let data = await response.json()


    if (response.status === 200) {
      setNameCategories(data.categories.map(category => category.name))
    }
  }

  const refContent = useRef()

  useEffect(() => {
    refContent.current.parentNode.id = "generate-flashcards"
  }, [refContent])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subject.split(" ").length <= 4 && subject.length <= 30) {
      try {
        const url = 'https://rbrain.onrender.com/generate-flashcards';
        const body = JSON.stringify({ theme: subject });
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access_token}`, // Aquí va el token de ejemplo
        };
        const response = await fetch(url, { method: 'POST', headers, body });

        const data = await response.json();
        setResponse(data);
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChange = (e) => {
    setSubject(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (category) {

        const url = 'https://rbrain.onrender.com/save-flashcards';
        const body = JSON.stringify({ lista_flashcards: response.lista_flashcards, 'theme': subject, 'category': category });

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access_token}`
        };
        const saveResponse = await fetch(url, { method: 'POST', headers, body });
        const saveData = await saveResponse.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Content
      refContent={refContent}
      title={"Generate flashcards"}
      flashcards={true}
      content={
        <>
          <form onSubmit={handleSubmit} className="theme">
            <p>Theme:</p><input type="text" value={subject} onChange={handleChange} placeholder="Ej: Descubrimientos de Einstein" /><Button href="#" clase="btn-generate" texto="Generate" />
          </form>
          {response && (
            <>
              <div className="generate-flashcards-container">
                <div className="generate-flashcards">
                  {response.lista_flashcards.map((card) => (
                    <EditableCard
                      key={card.title}
                      title={card.title}
                      info={card.info}
                      theme={response.theme}
                    />
                  ))}
                </div>
                <form onSubmit={handleSave}>
                  <select defaultValue='DEFAULT' onChange={handleCategoryChange}>
                    <option value="DEFAULT" disabled hidden>Select an option</option>
                    {nameCategories.map(category => <option key={category}>{category}</option>)} </select>
                  <Button href="#" clase="btn-save" texto="Save" type="submit" />
                </form>
              </div>
            </>
          )
          }
        </>
      }
    />
  )
};

export const MakeResume = () => {

  const refContent = useRef()

  useEffect(() => {
    refContent.current.parentNode.id = "make-resume"
  }, [refContent])

  return (
    <Content
      refContent={refContent}
      title="Categories"
      flashcards={true}
      add={true}
      content={null}
    />
  )
};