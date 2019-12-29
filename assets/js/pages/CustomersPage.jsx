import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import { Link } from 'react-router-dom';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const fetchCustomers = async() =>{
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data);
        } catch(error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    
    const handleDelete = async id => {
        
        // 1. approche optimiste et réactive
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))

        // 2. approche pessimiste et moins réactive
        try {
            await CustomersAPI.delete(id);
            console.log("ok");
        } catch(error) {
            setCustomers(originalCustomers);
            console.log(error.response);
        }
    };
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 8;

    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase())|| 
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
    ) ;


    return ( 
    <>
    
    <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-info">
            Créer un client
        </Link>
    </div>
    
    

    <div className="form-group">
        <input 
            type="text" 
            onChange={handleSearch} 
            value={search} placeholder="Rechercher ..." 
            className="form-control"
        />
    </div>

    <table className="table table-hover">
        <thead>
            <tr>
                <th>Id</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th className="text-center">Factures</th>
                <th className="text-center">Montant total</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            { paginatedCustomers.map(customer => <tr key={customer.id}>
                <td>{customer.id}</td>
                <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                    <span className="badge badge-primary">
                        {customer.invoices.length}
                    </span>
                </td>
                <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                <td>
                    <Link to={"/customers/" + customer.id} className="btn btn-sm btn-info mr-1">Editer</Link>
                    <button 
                        onClick={() => handleDelete(customer.id)}
                        disabled={customer.invoices.length > 0} 
                        className="btn btn-sm btn-danger"
                    >
                    Supprimer
                    </button></td>
            </tr> )}
            
        </tbody>
    </table>

    {itemsPerPage < filteredCustomers.length && (<Pagination 
        currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        length={filteredCustomers.length} 
        onPageChanged={handlePageChange} 
    />)}

    </>

    );
};
 
export default CustomersPage;