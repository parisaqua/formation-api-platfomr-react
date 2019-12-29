import React, {useState, useContext} from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';
import { toast } from 'react-toastify';

const LoginPage = ({ history }) => {
    
    const {setIsAuthenticated} = useContext(AuthContext)
    
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    // gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget; 
        setCredentials({...credentials, [name]: value})
    };

    // gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes bien connecté !");
            history.replace("/customers");

        } catch(error) {
            //console.log(error.response);
            setError("Aucun compte avec cet email ou les informations ne correspondent pas !");
            toast.error("Une erreur est survenue !");
        }
    }
    
    return ( <>
        <h1>Connexion à l'application</h1>

        <form onSubmit={handleSubmit}>
            <Field 
                label="Adresse mail" 
                name="username" 
                value={credentials.username}
                onChange={handleChange}
                type="email" 
                placeholder="Adresse email de connexion" 
                error={error}
            />
            <Field 
                label="Mot de passe" 
                name="password" 
                value={credentials.password}
                onChange={handleChange}
                type="password" 
                // placeholder="Mot de passe" 
                error={error}
            />
            <div className="form-group">
                <button type="submit" className="btn btn-success">Connexion</button>
            </div>
        </form>

    </> );
}
 
export default LoginPage;