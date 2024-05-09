import { URL_BASE, tokenKey } from "../constants";

export async function getCreditos(responsableId,fecha1, fecha2, nroDocumento){
    //const token = authProvider.token;
    
    responsableId = isNaN(parseInt(responsableId))? 0 : responsableId;
    nroDocumento = isNaN(parseInt(nroDocumento))?0:nroDocumento;
    const url = `${URL_BASE}/creditos/${responsableId}/${fecha1}/${fecha2}/${nroDocumento}`;
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

export async function createdCredito(formData){
    const url = `${URL_BASE}/creditos`;
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

export async function editCredito(id, updateData){
    const url = `${URL_BASE}/creditos/${id}`;
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

export async function deleteCredito(id){
    const url = `${URL_BASE}/creditos/${id}`;
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

export async function getNroComprobante(id){
    //const token = authProvider.token;

    const url = `${URL_BASE}/creditos/comprobante/${id}`;
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