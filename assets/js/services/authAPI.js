import axios from "axios";
import CustomersAPI from "./customersAPI";
import jwtDecode from "jwt-decode";


/**
 * Déconnexion (suppression du token du localstorage et sur axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token sur le localstorage et sur axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token =>{
            // Je stocke le token dans mon local storage
            window.localStorage.setItem("authToken", token);

            // On prévient Axios qu'on a un header par default sur toutes nos futures requêtes HTTP
            setAxiosToken(token);
        })  
}

/**
 * Positionne le token jwt sur axios
 * @param {string} token le token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise ne place lors du chargement de l'application
 */
function setup() {
    //1. Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    //2. Si le token est encor valide
    if(token) {
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        } 
    } 
}

/**
 * Permet de savoir si on est indentifié ou pas
 */
function isAuthenticated() {
     //1. Voir si on a un token
     const token = window.localStorage.getItem("authToken");
     //2. Si le token est encor valide
     if(token) {
        const {exp: expiration} = jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {
           return true;
        }
        return false; 
     }
     return false;
}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};