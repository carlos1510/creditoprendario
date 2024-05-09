import { createBrowserRouter } from "react-router-dom";
import App from "./routes/App";
import Login from "./routes/Login/Login";
import Home from "./components/Home/Home";
import Cobro from "./components/Cobro/Cobro";
import Gasto from "./components/Gasto/Gasto";
import PagoAlquiler from "./routes/PagoAlquiler/PagoAlquiler";
import Servicio from "./components/Servicio/Servicio";
import Usuario from "./routes/Usuario/Usuario";
import Empresa from "./routes/Empresa/Empresa";
import Empresas from "./routes/Empresas";
import Cajas from "./routes/Cajas/Cajas";
import Creditos from "./routes/Creditos/Creditos";

export const router = createBrowserRouter([
    {
        id: "app",
        path: "/home?",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "servicio",
                element: <Servicio />,
                
            },
            {
                path: "usuario",
                element: <Usuario />
            },
            {
                path: "caja",
                element: <Cajas />
            },
            {
                path: "cobros",
                element: <Cobro />
            },
            {
                path: "gasto",
                element: <Gasto />
            },
            {
                path: "pagoAlquiler",
                element: <PagoAlquiler />
            },
            {
                path: "credito",
                element: <Creditos />
            },
            {
                path: "empresa",
                element: <Empresa />
            },
            {
                path: "empresas",
                element: <Empresas />
            }
        ]
        
    },
    {
        path: "/login",
        element: <Login />
    }
])