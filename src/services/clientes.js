import { URL_BASE, tokenKey } from "../constants";

export async function getClienteByNroDoc(tipodocumento, numerodocumento){
    //const token = authProvider.token;

    const url = `${URL_BASE}/clientes/${tipodocumento}/${numerodocumento}`;
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