import { URL_BASE, tokenKey } from "../constants";

export async function getServicios(){
    //const token = authProvider.token;

    const url = `${URL_BASE}/servicios`;
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

export async function getServicio(id){
    const url = `${URL_BASE}/servicios/${id}`; 
    
    //const token = window.localStorage.getItem(tokenKey); 

    const options = {
        method: "GET",
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

export async function saveServicio(formData){
    const url = `${URL_BASE}/servicios`;

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

export async function editServicio(id, updateDate){
    const url = `${URL_BASE}/servicios/${id}`; 
    
    //const token = window.localStorage.getItem(tokenKey); 

    const options = {
        method: "PATCH",
        body: JSON.stringify(updateDate),
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

    /*if (response.status === 401) {
        authProvider.logout();
        throw redirect("/login");
    }*/

    const body = await response.json();
    return Promise.reject(new Error(body.error));
}