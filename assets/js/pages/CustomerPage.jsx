import React, {useState, useEffect} from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
    
    const {id = "new"} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    // Récupération du custmer en fonction de l'id
    const fetchCustomer = async id => {
        try{
            const { firstName, lastName, email, company} = await CustomersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
            
        } catch (error) {
            console.log(error.response);
            //Notification flash d'une erreur
            history.replace("/customers");
        }
    }
       
    // Chargement du customer si besoin au chargement du composant ou changement de l'identifiant
    useEffect(() => {
          if(id !== "new") {
               setEditing(true);
               fetchCustomer(id);
          }
    }, [id]);

    //Gestion des changements de l'input dans le formulaire
    const handleChange = ({ currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    //Gestion de l'envoi du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if(editing) {
                await CustomersAPI.update(id, customer);
                //TODO notification de succes
                history.replace("/customers");
            } else {
               await CustomersAPI.create(customer);
                // TODO notif de succes
                history.replace("/customers");
            }
            
           setErrors({});
           //console.log(response.data);

        } catch ({ response }) {
            const { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
            });

            setErrors(apiErrors);

            //console.log(apiErrors);
            //TODO flash notif d'erreurs
            }
        }

    };
    
    return ( 
        <>
            {(!editing && <h1>Création d'un client</h1>) || ( <h1>Modification d'un client</h1> )}

            <form onSubmit={handleSubmit}>
                <Field 
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                 <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                 <Field 
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Adresse mail du client"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                 <Field 
                    name="company"
                    label="Société"
                    placeholder="Société du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retourner à la liste</Link>
                </div>
            </form>
        </> 
    );
}
 
export default CustomerPage;