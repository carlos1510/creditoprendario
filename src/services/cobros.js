import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getCobros(responsableId,fecha1, fecha2, nroDocumento){
    const token = window.localStorage.getItem(tokenKey); 
    
    responsableId = isNaN(parseInt(responsableId))? 0 : responsableId;
    nroDocumento = isNaN(parseInt(nroDocumento))?0:nroDocumento;
    const url = `${URL_BASE}/pagos/${responsableId}/${fecha1}/${fecha2}/${nroDocumento}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }
}

export async function createdCobro(formData){
    const url = `${URL_BASE}/pagos`;
    const token = window.localStorage.getItem(tokenKey); 

    const options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }
}

export async function editCobro(id, updateData){
    const url = `${URL_BASE}/pagos/${id}`;
    const token = window.localStorage.getItem(tokenKey); 

    const options = {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }
}

export async function deleteCobro(id){
    const url = `${URL_BASE}/pagos/${id}`;
    const token = window.localStorage.getItem(tokenKey); 

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }
}

export async function getNroComprobantePago(id){
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/pagos/comprobante/${id}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }
}

export async function getNumeroPago() {
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/obtenerNroPago`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }
}

export async function getImprimirTicketPago(id) {
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/imprimirTicketPagos/${id}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    const body = await response.json();

    return body;
        
}
