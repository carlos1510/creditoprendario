import { URL_BASE, tokenKey } from "../constants";

export async function getDetalleCreditoByIdCredito(creditoId){
    //const token = authProvider.token;
    
    const url = `${URL_BASE}/detallecreditos/creditos/${creditoId}`;
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