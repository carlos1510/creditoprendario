import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getUsuarios(){
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/usuarios`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok){
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if(response.status === 401){
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function getUsuariosByEmpresa(){
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/usuarios/empresa`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok){
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if(response.status === 401){
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function createdUser(formData){
    const url = `${URL_BASE}/usuarios`;
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

    if(response.ok){
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if(response.status === 401){
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}

export async function editUser(id, updateData){
    const url = `${URL_BASE}/usuarios/${id}`;
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

export async function getUsuarioByNroDoc(tipodocumento, numerodocumento){
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/usuarios/${tipodocumento}/${numerodocumento}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok){
        const body = await response.json();
        return body.data;
    }else{
        return response.status;
    }

    /*if(response.status === 401){
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));*/
}