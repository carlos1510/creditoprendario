import { URL_BASE, tokenKey } from "../constants";

export async function getCajas(fecha1, fecha2){
    //const token = authProvider.token;

    const url = `${URL_BASE}/cajas/${fecha1}/${fecha2}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            //Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    const body = await response.json();
    return body.data;
}

export async function createdCaja(formData){
    const url = `${URL_BASE}/cajas`;
    const options = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
            //Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if(response.ok) {
        const body = await response.json();
        return body.data;
    }

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}

export async function editCaja(id, updateData){
    const url = `${URL_BASE}/cajas/${id}`;
    //const token = window.localStorage.getItem(tokenKey); 

    const options = {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
          //Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.data;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }*/

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}

export async function deleteCaja(id){
    const url = `${URL_BASE}/cajas/${id}`;
    //const token = window.localStorage.getItem(tokenKey);

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            //Authorization: `bearer ${token}`,
        },
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const body = await response.json();
        return body.ok;
    }

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }*/

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}