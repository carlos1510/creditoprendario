import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./routes/Login/Login";
import Home from "./components/Home/Home";
//import Servicio from "./components/Servicio/Servicio";
import Usuario from "./components/Usuario/Usuario";

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
                path: "service",
                element: <h1>Servicio</h1>
            },
            {
                path: "usuario",
                element: <Usuario />
            }
        ]
        
    },
    {
        path: "/login",
        element: <Login />
    }
])