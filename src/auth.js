import { URL_BASE, tokenKey, userName, rol } from "./constants";

const savedToken = window.localStorage.getItem(tokenKey);
const savedUsername = window.localStorage.getItem(userName);
const savedRol = window.localStorage.getItem(rol);

export const authProvider = {
    isAuthenticated: savedToken !== null,
    token: savedToken,
    username: savedUsername,
    rol: savedRol,
    async login(username, password){
        const url = URL_BASE + "/auth/login";
        const options = {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(url, options);

        if(response.ok) {
            const body = await response.json();

            authProvider.isAuthenticated = true;
            authProvider.token = body.data.token;
            authProvider.username = body.data.user.nombres;
            authProvider.rol = body.data.user.rol;
            window.localStorage.setItem(tokenKey, body.data.token);
            window.localStorage.setItem(userName, body.data.user.nombres);
            window.localStorage.setItem(rol, body.data.user.rol);
        }else{
            const error = await response.json();
            throw new Error(error.error);
        }
    },
    async logout(){
        const url = URL_BASE + "/auth/logout";
        const token = window.localStorage.getItem(tokenKey);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`,
            },
        };

        const response = await fetch(url, options);
        
        if(response.ok) {
            window.localStorage.removeItem(tokenKey);
            window.localStorage.removeItem(userName);
            window.localStorage.removeItem(rol);

            authProvider.isAuthenticated = false;
            authProvider.token = null;
            authProvider.username = null;
            authProvider.rol = null;
        }else {
            window.localStorage.removeItem(tokenKey);
            window.localStorage.removeItem(userName);
            window.localStorage.removeItem(rol);

            authProvider.isAuthenticated = false;
            authProvider.token = null;
            authProvider.username = null;
            authProvider.rol = null;
        }

        /*if(response.status === 401){
            window.localStorage.removeItem(tokenKey);
            window.localStorage.removeItem(userName);
            window.localStorage.removeItem(rol);

            authProvider.isAuthenticated = false;
            authProvider.token = null;
            authProvider.username = null;
            authProvider.rol = null;
        }*/

    }
}