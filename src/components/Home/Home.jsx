import * as React from 'react';
import { Link } from 'react-router-dom';


function Home(){
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center items-center px-2 mx-auto">
  
                <article
                    className="bg-white  p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                    <Link to="/servicio"
                        className="absolute opacity-0 top-0 right-0 left-0 bottom-0" />
                    <div className="relative mb-4 rounded-2xl">
                        <img className="max-h-80 rounded-2xl pl-14 object-cover transition-transform duration-300 transform group-hover:scale-105" style={{ height: '235px'}}
                            src="./img/servicios.png" alt="" />
                        
                        <Link className="flex justify-center items-center bg-cyan-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                            to="/servicio">
                            Ir a
                            <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>
                    <div className="flex justify-between items-center w-full pb-4 mb-auto"></div>
                    <h3 className="font-medium text-xl leading-8">
                        <Link to="/servicio"
                            className="block relative group-hover:text-red-700 transition-colors duration-200 ">
                            SERVICIOS
                        </Link>
                    </h3>
                </article>

                <article
                        className="bg-white  p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                        <Link to="/credito"
                            className="absolute opacity-0 top-0 right-0 left-0 bottom-0" />
                        <div className="relative mb-4 rounded-2xl">
                            <img className="max-h-80 rounded-2xl pl-14 object-cover transition-transform duration-300 transform group-hover:scale-105" style={{ height: '235px'}}
                                src="./img/credito.png" alt="" />
                            

                            <Link className="flex justify-center items-center bg-cyan-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                                to="/credito">
                                Ir a
                                <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="flex justify-between items-center w-full pb-4 mb-auto"></div>
                        <h3 className="font-medium text-xl leading-8">
                            <Link to="/credito"
                                className="block relative group-hover:text-red-700 transition-colors duration-200 ">
                                CREDITOS
                            </Link>
                        </h3>
                    </article>


                    <article
                        className="bg-white  p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                        <Link to="/cobro"
                            className="absolute opacity-0 top-0 right-0 left-0 bottom-0" />
                        <div className="relative mb-4 rounded-2xl ">
                            <img className="max-h-80  rounded-2xl pl-14 object-cover transition-transform duration-300 transform group-hover:scale-105" style={{ height: '235px'}}
                                src="./img/pago.png" alt="" />
                            
                            <Link className="flex justify-center items-center bg-cyan-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                                to="/cobro">
                                Ir a
                                <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="flex justify-between items-center w-full pb-4 mb-auto"></div>
                        <h3 className="font-medium text-xl leading-8">
                            <Link to="/cobro"
                                className="block relative group-hover:text-red-700 transition-colors duration-200 ">
                                COBRAR
                            </Link>
                        </h3>
                    </article>

                    <article
                        className="bg-white  p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                        <Link to="/caja"
                            className="absolute opacity-0 top-0 right-0 left-0 bottom-0" />
                        <div className="relative mb-4 rounded-2xl ">
                            <img className="max-h-80  rounded-2xl pl-14 object-cover transition-transform duration-300 transform group-hover:scale-105" style={{ height: '235px'}}
                                src="./img/caja.png" alt="" />
                            
                            <Link className="flex justify-center items-center bg-cyan-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                                to="/caja">
                                Ir a
                                <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="flex justify-between items-center w-full pb-4 mb-auto"></div>
                        <h3 className="font-medium text-xl leading-8">
                            <Link to="/caja"
                                className="block relative group-hover:text-red-700 transition-colors duration-200 ">
                                CAJA
                            </Link>
                        </h3>
                    </article>

                    <article
                        className="bg-white  p-6 mb-6 shadow transition duration-300 group transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl cursor-pointer border">
                        <a to="/usuario"
                            className="absolute opacity-0 top-0 right-0 left-0 bottom-0" />
                        <div className="relative mb-4 rounded-2xl ">
                            <img className="max-h-80  rounded-2xl pl-14 object-cover transition-transform duration-300 transform group-hover:scale-105" style={{ height: '235px'}}
                                src="./img/usuarios.png" alt="" />
                            
                            <Link className="flex justify-center items-center bg-cyan-700 bg-opacity-80 z-10 absolute top-0 left-0 w-full h-full text-white rounded-2xl opacity-0 transition-all duration-300 transform group-hover:scale-105 text-xl group-hover:opacity-100"
                                to="/usuario">
                                Ir a
                                <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className="flex justify-between items-center w-full pb-4 mb-auto"></div>
                        <h3 className="font-medium text-xl leading-8">
                            <Link to="/usuario"
                                className="block relative group-hover:text-red-700 transition-colors duration-200 ">
                                Usuario
                            </Link>
                        </h3>
                    </article>
            </div>
    
        </>
    );
}

export default Home;