import { URL_BASE, tokenKey } from "../constants";


export async function createdSaldoAlquiler(formData){
    const url = `${URL_BASE}/saldoalquileres`;
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

