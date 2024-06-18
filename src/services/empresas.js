import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getEmpresas(){
    const token = authProvider.token;

    const url = `${URL_BASE}/empresas`;
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
}

export async function createdEmpresa(formData){
    const url = `${URL_BASE}/empresas`;
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
}

export async function editEmpresa(id, updateData){
    const url = `${URL_BASE}/empresas/${id}`;
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

export async function deleteEmpresa(id){
    const url = `${URL_BASE}/empresas/${id}`;
    const token = window.localStorage.getItem(tokenKey);

    const options = {
        method: "DELETE",
        headers: {
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