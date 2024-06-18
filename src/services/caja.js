import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getCajas(fecha1, fecha2){
    const token = window.localStorage.getItem(tokenKey);

    const url = `${URL_BASE}/cajas/${fecha1}/${fecha2}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }*/

    /*const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function createdCaja(formData){
    const url = `${URL_BASE}/cajas`;
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

    if(response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function editCaja(id, updateData){
    const url = `${URL_BASE}/cajas/${id}`;
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

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function deleteCaja(id){
    const url = `${URL_BASE}/cajas/${id}`;
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

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function getCierraCaja(id){
    const token = window.localStorage.getItem(tokenKey);

    const url = `${URL_BASE}/cajas/${id}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function cerrarCaja(formData){
    const token = window.localStorage.getItem(tokenKey);
    const url = `${URL_BASE}/cajas/cierre`;
    const options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function obtenerAperturaCaja(){
    const token = window.localStorage.getItem(tokenKey);
    const url = `${URL_BASE}/cajas/obtenerapertura`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok) {
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}