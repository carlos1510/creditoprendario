import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./routes/Login/Login";
import Home from "./components/Home/Home";
//import Servicio from "./components/Servicio/Servicio";
import Usuario from "./components/Usuario/Usuario";
import Caja from "./components/Caja/Caja";
import Cobro from "./components/Cobro/Cobro";
import Gasto from "./components/Gasto/Gasto";
import PagoAlquiler from "./components/PagoAlquiler/PagoAlquiler";
import Credito from "./components/Credito/Credito";
import Servicio from "./components/Servicio/Servicio";
import Empresa from "./components/Empresa/Empresa";

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
                element: <Servicio />
            },
            {
                path: "usuario",
                element: <Usuario />
            },
            {
                path: "caja",
                element: <Caja />
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
                element: <Credito />
            },
            {
                path: "empresa",
                element: <Empresa />
            }
        ]
        
    },
    {
        path: "/login",
        element: <Login />
    }
])