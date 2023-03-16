import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Content from "../componentes/Content";
import Button from "../componentes/Button";
import Flashcard from "../componentes/Flashcard";

export const Profile = () => {

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

  return (
    <Content
      id="profile"
      title="My carpets"
      add={true}
      contenido={
        <div className="categories">
          {categories.map(category => (
            <div key={category.id}>
              <Link className="category" to={`http://localhost:3000/profile/my-flashcards/${category.id}`}>
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      }
    />
  )
}

export const Login = () => {

  let { loginUser } = useContext(AuthContext)

  return (
    <div>
      <Content
        id="login"
        title="Login"
        upgrade={false}
        contenido={
          <form onSubmit={loginUser}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="example@example.com" />
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" placeholder="••••••••••" />
            <input id="submit" type="submit" value="Iniciar Sesión" />
            <p className="btn-fotgotten-password">Olvidé mi contraseña</p>
          </form>
        }
      />
    </div>
  )
};

export const Home = () => {

  return (
    <Content
      id="home"
      title="Categories"
      flashcards={true}
      add={true}
      contenido={null}
    />
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
        id="category"
        title={mostrarTitulo()}
        flashcards={true}
        add={true}
        isLoading={isLoading}
        errorMsg={errorMsg}
        contenido={
          <div className="flashcards">
            {flashcards.map((flashcard) => (
              <Flashcard
                key={flashcard.title}
                title={flashcard.title}
                mostrarTheme={true}
                theme={flashcard.theme}
              />
            ))}
          </div>
        }
      />
    </>
  );
};

export const GenerateFlashcards = () => {
  let { authTokens } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [response, setResponse] = useState(null);
  const [category, setCategory] = useState('');

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
      id="generate-flashcards"
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
  );
};