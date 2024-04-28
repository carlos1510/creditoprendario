import * as React from 'react';
import { Form, Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 

function Servicio(){

    const [register, setRegister] = React.useState(false);
    const [value, setValue] = React.useState({ 
        startDate: null ,
        endDate: null 
    }); 
        
    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue); 
        setValue(newValue); 
    } 

    return (
        <>
        {register ? (
            <div className="bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                <h2 className="text-gray-500 text-lg font-semibold pb-4">Registro</h2>
                <div className="my-1"></div> 
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                <Form >
                    <div className="grid grid-cols-4">
                        <div className="ml-2 mr-2 col-span-4 md:col-span-1 sm:col-span-4">
                            <label htmlFor="">TIPO DE SERVICIO</label>
                            <input type="text" className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " />
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="">PERIODO</label>
                            <select className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " >
                                <option value="">---</option>
                                <option value="DIAS">DIAS</option>
                                <option value="SEMANAS">SEMANAS</option>
                                <option value="MES">MES</option>
                            </select>
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="">NUMERO DEL PERIODO</label>
                            <input type="number" className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " />
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="">PORCENTAJE</label>
                            <input type="number" className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 ">
                        <div className="ml-2 mr-2 pt-5">
                            <label htmlFor="">DESCRIPCION</label>
                            <textarea  className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " ></textarea>
                        </div>
                        
                    </div>
                    
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    
                    <div className="grid grid-cols-2">
                        <div className="text-left">
                            <button type="button" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded ">
                                <i className="fas fa-save"></i> Guardar
                            </button>
                        </div>
                        <div className="text-right">
                            <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded  " onClick={()=> setRegister(!register)}>
                                <i className="fas fa-times"></i> Salir
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        )
            :
        (
            <div className="bg-white p-4 rounded-md mt-4">
                <div className="grid grid-cols-2">
                    <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista</h2>
                    <div className="text-right">
                        <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded" onClick={()=> setRegister(!register)}>
                            <i className="fas fa-plus-circle"></i> Agregar
                        </button>
                    </div>
                </div>
                <div className="my-1"></div> 
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                
                <div className="grid grid-cols-2">
                    <div className="text-left mt-4">
                        <span>Mostrando 1 de 10</span>
                    </div>
                    <div className="text-right mt-4">
                        <span className="pr-2">Ver</span>
                        <select className="border border-grey-light">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
                <table className="w-full table-auto text-sm border-t border-grey-light">
                    <thead>
                        <tr className="text-sm leading-normal">
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TIPO DE SERVICIO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DESCRIPCION</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PERIODO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. PERIODO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PORCENTAJE</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-grey-lighter">
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded"><i className="fas fa-edit"></i></Link>
                                <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-trash-alt"></i></Link>
                            </td>
                        </tr>
                        <tr className="hover:bg-grey-lighter">
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded"><i className="fas fa-edit"></i></Link>
                                <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-trash-alt"></i></Link>
                            </td>
                        </tr>
                        <tr className="hover:bg-grey-lighter">
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                            <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                            <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded"><i className="fas fa-edit"></i></Link>
                                <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-trash-alt"></i></Link>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>

                <div class="flex justify-center pt-4">
                    <nav class="flex space-x-2" aria-label="Pagination">
                        <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Previous
                        </a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            1
                        </a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            2
                        </a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            3
                        </a>
                        <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                            Next
                        </a>
                    </nav>
                </div>

                
            </div>
        )}
        </>
    );
}

export default Servicio;