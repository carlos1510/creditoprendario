import * as React from 'react';
import { Form, Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 

function Gasto(){
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
                <div className="  bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">NUEVO PAGO</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <Form className="max-w-screen-lg mx-auto">
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nro. Documento</label>
                                <input type="text" id="base-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <button type="button" className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto md:mt-7 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <i className='fas fa-search'></i> Buscar
                                </button>
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres y Apellidos del Cliente</label>
                            <input type="text" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto Prestado</label>
                                <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interés a la Fecha</label>
                                <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto Total</label>
                                <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de Pago</label>
                                <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label for="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto Recibido</label>
                                <input type="number" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                        </div>
                        
                        <button type="submit" className="text-white bg-blue-700 mt-2 mr-1 ml-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <i className='fas fa-save'></i> Guardar
                        </button>
                        <button type="button" className="text-white bg-red-700 mt-2 mr-1 ml-1 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" 
                        onClick={()=> setRegister(!register)}>
                            <i className='fas fa-times'></i> Salir
                        </button>
                    </Form>
                </div>
            ) : (
                <div className='grid grid-cols-1'>
                    <div className="text-right ">
                        <button className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto text-white font-semibold py-2 px-4 rounded" onClick={()=> setRegister(!register)}>
                            <i className="fas fa-plus-circle"></i> Agregar
                        </button>
                    </div>
                
                    <div className="bg-white p-4 rounded-md mt-4">
                        <div className="grid grid-cols-2">
                            <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Gastos</h2>
                        </div>
                        <div className="my-1"></div> 
                        <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="mb-4">
                                    <label >DE: </label>
                                    <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                        useRange={false} 
                                        asSingle={true} 
                                        value={value} 
                                        onChange={handleValueChange} 
                                        displayFormat={"DD/MM/YYYY"} 
                                    />
                            </div>

                            <div className="mb-4">
                                    <label >HASTA: </label>
                                    <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                        useRange={false} 
                                        asSingle={true} 
                                        value={value} 
                                        onChange={handleValueChange} 
                                        displayFormat={"DD/MM/YYYY"} 
                                        />
                            </div>

                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 hover:to-indigo-400 text-white font-semibold mt-5 py-3 px-4 rounded" >
                                    <i className="fas fa-search"></i> Buscar
                                </button>
                            </div>
                        </div>
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
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DNI</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Nombre cliente</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Servicio</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha de Evaluación</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Monto</th>
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
                                    <td className="py-2 px-4 border-b border-grey-light text-right">$1500</td>
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
                                    <td className="py-2 px-4 border-b border-grey-light text-right">$1500</td>
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
                                    <td className="py-2 px-4 border-b border-grey-light text-right">$1500</td>
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
                                    <td className="py-2 px-4 border-b border-grey-light text-right">$1500</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">
                                        <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded"><i className="fas fa-edit"></i></Link>
                                        <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-trash-alt"></i></Link>
                                    </td>
                                </tr>
                                
                                
                            </tbody>
                        </table>

                        <div className="flex justify-center pt-4">
                            <nav className="flex space-x-2" aria-label="Pagination">
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                                    Previous
                                </a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                                    1
                                </a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                                    2
                                </a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-fuchsia-100 hover:bg-fuchsia-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                                    3
                                </a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10">
                                    Next
                                </a>
                            </nav>
                        </div>

                        
                    </div>
                </div>
            )}
        </>
    );
}

export default Gasto;