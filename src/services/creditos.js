import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getCreditos(responsableId,fecha1, fecha2, nroDocumento){
    const token = window.localStorage.getItem(tokenKey); 
    
    responsableId = isNaN(parseInt(responsableId))? 0 : responsableId;
    nroDocumento = isNaN(parseInt(nroDocumento))?0:nroDocumento;
    const url = `${URL_BASE}/creditos/${responsableId}/${fecha1}/${fecha2}/${nroDocumento}`;
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

export async function createdCredito(formData){
    const url = `${URL_BASE}/creditos`;
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

export async function editCredito(id, updateData){
    const url = `${URL_BASE}/creditos/${id}`;
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

export async function deleteCredito(id){
    const url = `${URL_BASE}/creditos/${id}`;
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

export async function getNroComprobante(id){
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/creditos/comprobante/${id}`;
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

export async function getCreditoByDocumento(fecha1, fecha2, nroDocumento){
    const url = `${URL_BASE}/creditos/cliente/${nroDocumento}`;
    const token = window.localStorage.getItem(tokenKey); 

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

export async function getNumeroContratoCredito() {
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/obtenerNroContratoCredito`;
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

export async function getImprimirTicketCredito(id) {
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/imprimirTicketCredito/${id}`;
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