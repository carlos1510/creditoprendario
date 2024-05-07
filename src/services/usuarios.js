import { URL_BASE, tokenKey } from "../constants";

export async function getUsuarios(){
    //const token = authProvider.token;

    const url = `${URL_BASE}/usuarios`;
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

export async function createdUser(formData){
    const url = `${URL_BASE}/usuarios`;
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

export async function editUser(id, updateData){
    const url = `${URL_BASE}/usuarios/${id}`;
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