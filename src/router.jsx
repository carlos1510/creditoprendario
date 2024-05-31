import { createBrowserRouter } from "react-router-dom";
import App, { loader as rootLoader } from "./routes/App";
import Login, { action as loginAction } from "./routes/Login/Login";
import Home from "./components/Home/Home";
import Gasto from "./components/Gasto/Gasto";
import PagoAlquiler from "./routes/PagoAlquiler/PagoAlquiler";
import Servicio from "./components/Servicio/Servicio";
import Usuario from "./routes/Usuario/Usuario";
import Empresa from "./routes/Empresa/Empresa";
import Empresas from "./routes/Empresas";
import Cajas from "./routes/Cajas/Cajas";
import Creditos from "./routes/Creditos/Creditos";
import Cobros from "./routes/Cobros/Cobros";
import Pagos from "./routes/Pagos/Pagos";
import { action as logoutAction } from "./routes/Logout/logout";

const baseruta = '/creditoprendario';

export const router = createBrowserRouter([
    {
        id: "app",
        path: "/home?",
        element: <App />,
        loader: rootLoader,
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
                path: "cobro",
                element: <Cobros />
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
            },
            {
                path: "pagos",
                element: <Pagos />
            }
        ]
        
    },
    {
        path: "/login",
        element: <Login />,
        action: loginAction,
    },
    {
        path: "/logout",
        action: logoutAction,
    },
], 
{basename: baseruta}
)