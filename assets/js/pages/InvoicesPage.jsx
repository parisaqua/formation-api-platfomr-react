import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import axios from "axios";
import moment from "moment";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "warning"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchInvoices = async () => {
        try {
            const data = await axios
                .get("http://localhost:8000/api/invoices")
                .then(response => response.data['hydra:member']);
            setInvoices(data);
        } catch(error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDelete = async id => {
        
        // 1. approche optimiste et réactive
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        // 2. approche pessimiste et moins réactive
        try {
            await InvoicesAPI.delete(id);
            console.log("ok");
        } catch(error) {
            setInvoices(originalInvoices);
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

    const itemsPerPage = 15;

    const filteredInvoices = invoices.filter(
        i => 
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) 
    );

    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    ) ;

    
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    return ( 
        <>
            <h1>Liste des factures</h1>

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
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map( invoice =>
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td> <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-info mr-1">Editer</button>
                                <button 
                                onClick={() => handleDelete(invoice.id)}
                                className="btn btn-sm btn-danger"
                                >
                                Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                    
                </tbody>
            </table>

            {itemsPerPage < filteredInvoices.length && (<Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                onPageChanged={handlePageChange} 
                length={filteredInvoices.length} 
            />)}

        </>
     );
};
 
export default InvoicesPage;