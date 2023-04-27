import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Content from "../componentes/Content";
import Button from "../componentes/Button";
import Flashcard from "../componentes/Flashcard";
import { useForm } from "react-hook-form";

export const Register = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()

  const navigate = useNavigate()

  const [errorRegisterPassword, setErrorRegisterPassword] = useState(false)

  let { loginUser } = useContext(AuthContext)

  const registerUser = async (email, contraseña) => {
    console.log(email, contraseña)
    let response = await fetch('https://rbrain.onrender.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'email': email, 'password': contraseña })
    })
    let data = await response.json()
    if (response.status === 201) {
      navigate('/login')
    } else {
      console.log("Error")
    }
  }

  const refContent = useRef()

  useEffect(() => {
    refContent.current.parentNode.id = "register"
  }, [refContent])

  const registerValidate = (valor) => {
    if (valor.registerPrimerPassword !== valor.registerSegundoPassword) {
      setErrorRegisterPassword(true)
    }
    else {
      setErrorRegisterPassword(false)
      registerUser(valor.registerEmail, valor.registerPrimerPassword)
    }
  }

  return (
    <Content
      refContent={refContent}
      title="Register"
      register={true}
      upgrade={false}
      contenido={
        <form onSubmit={handleSubmit(registerValidate)}>
          <label htmlFor="email">Email</label>
          <input className={errors.registerEmail ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('registerEmail', {
            required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          })} />
          {
            errors.registerEmail ? <div className="contenedor-error"><p>Ingresa un email</p></div> : null
          }
          <label htmlFor="password">Contraseña</label>
          <input className={errors.registerPrimerPassword || errorRegisterPassword ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('registerPrimerPassword', { required: true })} />
          {
            errors.registerPrimerPassword && !errorRegisterPassword ? <div className="contenedor-error"><p>Ingresa una contraseña</p></div> : null
          }
          <label htmlFor="password">Contraseña</label>
          <input className={errors.registerSegundoPassword || errorRegisterPassword ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('registerSegundoPassword', { required: true })} />
          {
            errors.registerSegundoPassword && !errorRegisterPassword ? <div className="contenedor-error"><p>Ingresa una contraseña</p></div> : null
          }
          {
            errorRegisterPassword ? <div className="contenedor-error"><p>Las contraseñas no coinciden</p></div> : null
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
      contenido={
        <form onSubmit={handleSubmit(loginUser)}>
          <label htmlFor="email">Email</label>
          <input className={errors.loginEmail || errorLoginApi ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('loginEmail', {
            required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          })} />
          {
            errors.loginEmail && !errorLoginApi ? <div className="contenedor-error"><p>Ingresa un email</p></div> : null
          }
          <label htmlFor="password">Contraseña</label>
          <input className={errors.loginPassword || errorLoginApi ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('loginPassword', { required: true })} />
          {
            errors.loginPassword && !errorLoginApi ? <div className="contenedor-error"><p>Ingresa una contraseña</p></div> : null
          }
          {
            errorLoginApi ? <div className="contenedor-error"><p>El email y/o la contraseña son incorrectos</p></div> : null
          }
          <input id="submit" type="submit" value="Iniciar Sesión" />
          <p className="opc-fotgotten-password">Olvidé mi contraseña</p>
        </form>
      }
    />
  )
};

export const Configuracion = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()

  let { loginUser } = useContext(AuthContext)

  const refContent = useRef()

  useEffect(() => {
    refContent.current.parentNode.id = "configuracion"
  }, [refContent])

  return (
    <Content
      refContent={refContent}
      title="Configuracion"
      configuracion={true}
      flashcards={true}
      add={false}
      contenido={
        <>
          <form onSubmit={handleSubmit(loginUser)}>
            <label htmlFor="email">Cambiar email</label>
            <input className={errors.configuracionEmail ? "error" : null} type="text" name="email" placeholder="example@example.com" {...register('configuracionEmail', {
              required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            })} />
            {
              errors.configuracionEmail ? <div className="contenedor-error"><p>Ingresa un email</p></div> : null
            }
            <label htmlFor="password">Cambiar contraseña</label>
            <input className={errors.configuracionPassword ? "error" : null} type="password" name="password" placeholder="••••••••••" {...register('configuracionPassword', { required: true })} />
            {
              errors.configuracionPassword ? <div className="contenedor-error"><p>Ingresa una contraseña</p></div> : null
            }
            <div className="contenedor-botones">
              <button className="info-pago">Tu información de pago</button>
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
        setModal(false)
        getCategories()
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (

    <>
      {modal ? <> <div onClick={closeModal} className="modal"></div>
        <input className="modal-input" onChange={getInputModal} /><button className="modal-input" onClick={addNewCategory}>Add</button>
      </>
        : null}

      <Content
        refContent={refContent}
        title="My carpets"
        add={true}
        addCategory={addCategory}
        contenido={
          <div className="categories">
            {categories.map(category => (
              <div key={category.id} className="category-container">
                <Link className="category" to={`/profile/my-flashcards/${category.id}`}>
                  {category.name}
                </Link>
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

          setFlashcards(data.flashcards);
          setCurrentCategoryFlashcards(data.category)
        } else {
          const errorMsg = data.error || 'No se encontraron flashcards';
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
    getFlashcards();
  }, [categoryId, authTokens, logoutUser]);

  const mostrarTitulo = () => {
    if (currentCategoryFlashcards.length > 0) {
      const titulo = currentCategoryFlashcards[0].toUpperCase() + currentCategoryFlashcards.slice(1)
      return `My carpet ${titulo}`
    }
  }

  return (
    <>
      <Content
        title={mostrarTitulo()}
        flashcards={true}
        isLoading={isLoading}
        errorMsg={errorMsg}
        contenido={
          <div className="flashcards">
            {flashcards.map((flashcard) => (
              <Flashcard
                category={true}
                key={flashcard.title}
                title={flashcard.title}
                mostrarTheme={true}
                theme={flashcard.theme}
                info={flashcard.info}
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

  const refContent = useRef()

  useEffect(() => {
    refContent.current.parentNode.id = "generate-flashcards"
  }, [refContent])

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error(error);
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
      const url = 'https://rbrain.onrender.com/save-flashcards';
      const body = JSON.stringify({ lista_flashcards: response.lista_flashcards, 'theme': subject, 'category': category });

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens.access_token}`
      };
      const saveResponse = await fetch(url, { method: 'POST', headers, body });
      const saveData = await saveResponse.json();
      console.log(saveData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Content
      refContent={refContent}
      title={"Generate flashcards"}
      flashcards={true}
      contenido={
        <>
          <form onSubmit={handleSubmit} className="theme">
            <p>Theme:</p><input type="text" value={subject} onChange={handleChange} /><Button href="#" clase="btn-generate" texto="Generate" />
          </form>
          {response && (
            <>
              <div className="generate-flashcards-container">
                <div className="generate-flashcards">
                  {response.lista_flashcards.map((card) => (
                    <Flashcard
                      key={card.title}
                      title={card.title}
                      info={card.info}
                      mostrarTheme={false}
                    />
                  ))}
                </div>
                <form onSubmit={handleSave}>
                  <input value={category} onChange={handleCategoryChange} />
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
      contenido={null}
    />
  )
};