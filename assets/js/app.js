// Les imposts importants
import React from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';


// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Hello World');


const App = () => {
    return (
    <HashRouter>
        <Navbar />
        <main className="container pt-5">
            <Switch>
                <Route path="/customers" component={CustomersPage} />
                <Route path="/invoices" component={InvoicesPage} />
                <Route path="/" component={HomePage} />
            </Switch>
        </main>
    </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);