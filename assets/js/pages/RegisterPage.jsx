import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import UsersAPI from "../services/UsersAPI";
import { toast } from 'react-toastify';

const RegisterPage = ({ history }) => {
    
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    
     //Gestion des changements de l'input dans le formulaire
     const handleChange = ({ currentTarget}) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };


    // Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};
        if(user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "La confirmation ne correspond pas à votre mot de passe ! ";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire ...");
            return;
        }

        try {
            await UsersAPI.register(user);
            setErrors({}); // important de le laisser avant le changement de page !
            toast.success("Vous êtes bien enregistré, connectez-vous !");
            history.replace("/login");
            
        } catch (error) {
            const {violations} = error.response.data;
            
            if(violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire ...");
            }

           
        }
    }
    
    return ( 
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName" 
                    label="Prénom" 
                    placeholder="Votre prénom" 
                    error={errors.firstName} 
                    value={user.firstName} 
                    onChange={handleChange} 
                />
                <Field 
                    name="lastName" 
                    label="Nom" 
                    placeholder="Votre nom de famille" 
                    error={errors.lastName} 
                    value={user.lastName} 
                    onChange={handleChange} 
                />
                <Field 
                    name="email" 
                    label="E-mail" 
                    placeholder="Votre adresse mail" 
                    type="email"
                    error={errors.email} 
                    value={user.email} 
                    onChange={handleChange} 
                />
                <Field 
                    name="password" 
                    label="Mot de passe" 
                    placeholder="Choisissez un mot de passe" 
                    type="password"
                    error={errors.password} 
                    value={user.password} 
                    onChange={handleChange} 
                />
                <Field 
                    name="passwordConfirm" 
                    label="Confirmation du mot de passe" 
                    placeholder="Comfirmez votre mot de passe" 
                    type="password"
                    error={errors.passwordConfirm} 
                    value={user.passwordConfirm} 
                    onChange={handleChange} 
                />

                <div className="form-group">
                    <button className="btn btn-success">
                    Confirmation
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>
            </form>
        </> 
    );
}
 
export default RegisterPage;