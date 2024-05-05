import * as React from 'react';
import { Form, Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import './style.css';

function Caja(){
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
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">APERTURA DE CAJA</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <form class="max-w-lg mx-auto">
                        <div className='relative z-0 w-full mb-5 group'>
                            <label for="cmbResponsable" >Responsable de la Caja</label>
                            <select id='cmbResponsable' className="block  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option>Really long option that will likely overlap the chevron</option>
                                <option>Option 2</option>
                                <option>Option 3</option>
                            </select>
                            
                        </div>
                        <div class="grid md:grid-cols-2 md:gap-6">
                            <div class="relative z-0 w-full mb-5 group">
                                <input type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de Apertura</label>
                            </div>
                            <div class="relative z-0 w-full mb-5 group">
                                <input type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Hora de Apertura</label>
                            </div>
                        </div>

                        <div class="relative z-0 w-full mb-5 group">
                            <input type="number" id="floating_repeat_password" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label for="floating_repeat_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Monto Inicial</label>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 mt-2 mr-1 ml-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <i className='fas fa-save'></i> Guardar
                        </button>
                        <button type="button" className="text-white bg-red-700 mt-2 mr-1 ml-1 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" 
                        onClick={()=> setRegister(!register)}>
                            <i className='fas fa-times'></i> Salir
                        </button>
                    </form>
                </div>
            ) 
            : 
            (
                <div className="bg-white p-4 rounded-md mt-4">
                    <div className="grid grid-cols-2">
                        <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Caja</h2>
                        <div className="text-right">
                            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded" onClick={()=> setRegister(!register)}>
                                <i className="fas fa-plus-circle"></i> Agregar
                            </button>
                        </div>
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

export default Caja;