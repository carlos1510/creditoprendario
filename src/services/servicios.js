import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getServicios(){
    const token = window.localStorage.getItem(tokenKey); 
    const url = `${URL_BASE}/servicios`;
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
    }

    if(response.status === 401){
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}

export async function getServicio(id){
    const url = `${URL_BASE}/servicios/${id}`; 
    
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
    }

    if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}

export async function saveServicio(formData){
    const url = `${URL_BASE}/servicios`;
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
    }

    if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}

export async function editServicio(id, updateData){
    const url = `${URL_BASE}/servicios/${id}`; 
    
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
    }

    if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}

export async function deleteServicio(id){
    const url = `${URL_BASE}/servicios/${id}`;
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
        return body.ok;
    }

    if (response.status === 401) {
        authProvider.logout();
        //const navigate = useNavigate();
        //navigate("/login");
        throw redirect("/login");
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}