import { URL_BASE, tokenKey } from "../constants";

export async function createdGasto(formData){
    const url = `${URL_BASE}/gastos`;
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

export async function getGastos(fecha1, fecha2){
    const token = window.localStorage.getItem(tokenKey);

    const url = `${URL_BASE}/gastos/${fecha1}/${fecha2}`;
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

export async function editGasto(id, updateData){
    const url = `${URL_BASE}/gastos/${id}`;
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

export async function deleteGasto(id){
    const url = `${URL_BASE}/gastos/${id}`;
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