import { redirect } from "react-router-dom";
import { authProvider } from "../auth";
import { URL_BASE, tokenKey } from "../constants";

export async function getClienteByNroDoc(tipodocumento, numerodocumento){
    const token = window.localStorage.getItem(tokenKey); 

    const url = `${URL_BASE}/clientes/${tipodocumento}/${numerodocumento}`;
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