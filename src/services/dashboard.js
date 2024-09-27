import { URL_BASE, tokenKey } from "../constants";

export async function getDashboard(fecha1, fecha2){
    const token = window.localStorage.getItem(tokenKey); 
    const url = `${URL_BASE}/dashboard/${fecha1}/${fecha2}`;
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
    }else{
        return response.status;
    }
}
