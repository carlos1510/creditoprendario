import React from "react";
import { Link } from "react-router-dom";


function Sidebar({hide}){

    const [showOpe, setShowOpe] = React.useState( false );
    const [showReporte, setShowReporte] = React.useState(false);
    const [showConfig, setShowConfig] = React.useState(false);
    
    return (
        <div className={hide ? "p-2 bg-gray-800 w-60 flex flex-col md:flex" : "p-2 bg-gray-800 w-60 flex flex-col hidden md:flex"} id="sideNav">
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/home" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                <i className="fas fa-home mr-2 text-center"></i> Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/cobro" className="block p-2 text-gray-50 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                            <i className="fas fa-money-bill-alt mr-2"></i> Cobrar
                            </Link>
                        </li>
                        <li>
                            <Link to="/servicio" className="block p-2 text-gray-50 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                <i className="fas fa-file-alt mr-2"></i> Servicio
                            </Link>
                        </li>
                        <li className="opcion-con-desplegable">
                            <div className="flex items-center justify-between p-2 text-gray-50 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white" onClick={()=> setShowOpe(!showOpe)}>
                                <div className="flex items-center">
                                <i className="fab fa-shopify mr-2"></i>
                                <span>Operaciones</span>
                                </div>
                                <i className={showOpe ? "fas fa-chevron-up text-xs": "fas fa-chevron-down text-xs"}></i>
                            </div>
                            <ul className={showOpe ? "desplegable ml-4": "desplegable ml-4 hidden"}>
                                <li>
                                    <Link to="/credito" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Creditos 
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link to="/pagos" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Pagos 
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gasto" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Gastos 
                                    </Link>
                                </li> */}
                            </ul>   
                        </li>
                        <li>
                            <Link to="/caja" className="block p-2 text-gray-50 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                <i className="fas fa-money-check-alt mr-2"></i> Caja
                            </Link>
                        </li>
                        {/* <li className="opcion-con-desplegable">
                            <div className="flex items-center justify-between p-2 text-gray-50 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white" onClick={()=> setShowReporte(!showReporte)}>
                                <div className="flex items-center">
                                    <i className="fas fa-chart-bar mr-2"></i>
                                    <span>Reportes</span>
                                </div>
                                <i className={showReporte ? "fas fa-chevron-up text-xs": "fas fa-chevron-down text-xs"}></i>
                            </div>
                            <ul className={showReporte ? "desplegable ml-4": "desplegable ml-4 hidden"}>
                                <li>
                                    <Link to="/" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Creditos 
                                    </Link>
                                </li>
                            </ul>   
                        </li> */}
                        <li className="opcion-con-desplegable">
                            <div className="flex items-center justify-between p-2 text-gray-50 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white" onClick={()=> setShowConfig(!showConfig)}>
                                <div className="flex items-center">
                                <i className="fas fa-cogs mr-2"></i>
                                <span>Configuracion</span>
                                </div>
                                <i className={showConfig ? "fas fa-chevron-up text-xs": "fas fa-chevron-down text-xs"}></i>
                            </div>
                            <ul className={showConfig ? "desplegable ml-4": "desplegable ml-4 hidden"}>
                                <li>
                                    <Link to="/usuario" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Usuarios 
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pagoAlquiler" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Pago Alquiler 
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/empresas" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Empresas
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link to="/empresa" className="block p-2 text-gray-50 flex items-center rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white">
                                        <i className="fas fa-chevron-right mr-2 text-xs"></i> Datos Empresa 
                                    </Link>
                                </li> */}
                            </ul>   
                        </li>
                    </ul>                   
                </nav>


                <Link to="" className="block text-center sm:text-left text-gray-50 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-300 hover:text-white mt-auto">
                    <i className="fas fa-sign-out-alt mr-2"></i><span className="hidden sm:inline">Cerrar sesión</span> 
                </Link>
                    
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mt-2"></div>

              
                <p className="mb-1 px-5 py-3 text-left text-xs text-cyan-500">Copyright CCVC@2024</p>

            </div>
    );
}

export default Sidebar;