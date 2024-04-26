import { Link } from "react-router-dom";

function Usuario(){
    return (
        <>
            <div className="grid mt-2 p-2">
                  <div className="bg-white p-4 rounded-md mt-2">
                    <div className="grid grid-cols-2">
                        <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista</h2>
                        <div className="text-right">
                            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded">
                                <i className="fas fa-plus-circle"></i> Agregar
                            </button>
                        </div>
                    </div>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <table className="min-w-full table-auto text-sm">
                                <thead className="justify-between">
                                    <tr className="text-sm leading-normal">
                                        <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Nombre</th>
                                        <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Usuario</th>
                                        <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light ">Rol</th>
                                        <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light ">Editar</th>
                                        <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light ">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Carlos Sánchez</td>
                                        <td className="py-2 px-4 border-b border-grey-light">27/07/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$1500</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Ana Torres</td>
                                        <td className="py-2 px-4 border-b border-grey-light">28/07/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$2000</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Juan Ramírez</td>
                                        <td className="py-2 px-4 border-b border-grey-light">29/07/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$1800</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">María Gómez</td>
                                        <td className="py-2 px-4 border-b border-grey-light">30/07/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$2100</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Luis González</td>
                                        <td className="py-2 px-4 border-b border-grey-light">31/07/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$1700</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Laura Pérez</td>
                                        <td className="py-2 px-4 border-b border-grey-light">01/08/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$2400</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Pedro Hernández</td>
                                        <td className="py-2 px-4 border-b border-grey-light">02/08/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$1950</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Sara Ramírez</td>
                                        <td className="py-2 px-4 border-b border-grey-light">03/08/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$1850</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-grey-lighter">
                                        <td className="py-2 px-4 border-b border-grey-light">Daniel Torres</td>
                                        <td className="py-2 px-4 border-b border-grey-light">04/08/2023</td>
                                        <td className="py-2 px-4 border-b border-grey-light">$2300</td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-edit"></i></Link>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-ligth text-center ">
                                            <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"><i className="fas fa-user-times"></i></Link>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>ñ

                  </div>

            </div>
        </>
    );
}

export default Usuario;