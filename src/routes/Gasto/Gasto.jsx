import * as React from 'react';
import { Form, Link, useNavigate } from "react-router-dom";
import { createdGasto, deleteGasto, editGasto, getGastos } from '../../services/gastos';
import { authProvider } from '../../auth';
import Swal from 'sweetalert2';
import { formatoFecha, pad } from '../../utils/util';
import Pagination from '../../components/Pagination/Pagination';
import { useTitle } from '../../components/Title/Title';
//import Datepicker from "react-tailwindcss-datepicker"; 

const initialValues = {
    fecha: "",
    monto: "",
    descripcion: "",
}

function Gasto(){
    useTitle('Gastos');
    const [register, setRegister] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [formData, setFormData] = React.useState(initialValues);
    const navigate = useNavigate();
    const [gastos, setGastos] = React.useState([]);
    const [fechaIni, setFechaIni] = React.useState("");
    const [fechaFin, setFechaFin] = React.useState("");

    const totalPage = gastos.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);

    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage;

    React.useEffect(() => {
        fechaActual();
        getLista();
    }, []);

    const fechaActual = () => {
        let date = new Date();

        let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
        let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        let dateIni = `${primerDia.getFullYear()}-${pad(primerDia.getMonth() + 1)}-${pad(primerDia.getDate())}`;
        let dateFin = `${ultimoDia.getFullYear()}-${pad(ultimoDia.getMonth() + 1)}-${pad(ultimoDia.getDate())}`;

        setFechaIni(dateIni);
        setFechaFin(dateFin);
    }

    function clearValues(){
        setFormData(initialValues);
    }

    async function getLista(){
        const [resultados] = await Promise.all([getGastos(fechaIni, fechaFin)]);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }
        
        setGastos(Array.isArray(resultados) ? resultados : []);
    }
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData:", formData);
        let response = null;
        try {
            if(isEdit){
                response = await editGasto(formData.id, formData);
            } else {
                response = await createdGasto(formData);
            }
            
            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
            setIsEdit(false);
            setRegister(false);
            setFormData(initialValues);
            Swal.fire({
                icon: "success", 
                title: "Exito!", 
                html: `<p>Se <strong>Cerro Caja</strong> Correctamente</p>`,
                timer: 3000,
                position: "center"
            });
            getLista();
        }catch (error) {
            console.log(error);
        }
    }

    const handleEdit = (gasto) => {
        setIsEdit(true);
        setFormData({
            id: gasto.id,
            fecha: gasto.fecha,
            monto: gasto.monto,
            descripcion: gasto.descripcion
        });
        setRegister(true);
    }

    const handleDelete = async (id) => {
        try {
            const response = await Swal.fire({
                title: '¿Está seguro?',
                text: "No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo!'
            });

            if (response.isConfirmed) {
                const result = await deleteGasto(id);
                if(result === 401){
                    authProvider.logoutStorage();
                    navigate("/login");
                }
                getLista();
            }
        }catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error", 
                title: "Error!", 
                text: "No se pudo eliminar el gasto",
                timer: 3000,
                position: "center"
            });
        }
    }

    const onChangePage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    }

    return (
        <>
            {register ? (
                <div className="  bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">{isEdit?'Editar':'Registrar'} Gasto</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <Form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit}>
                        
                        
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="fecha-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha</label>
                                <input 
                                    type="date" 
                                    id="fecha-input" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='fecha'
                                    placeholder='Fecha'
                                    required
                                    value={formData.fecha}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto</label>
                                <input 
                                    type="number" 
                                    id="base-input" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='monto'
                                    placeholder='Monto'
                                    required
                                    value={formData.monto}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción del Gasto</label>
                            <input 
                                type="text" 
                                id="base-input" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name='descripcion'
                                placeholder='Descripción del Gasto'
                                required
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
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
                        <button className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto text-white font-semibold py-2 px-4 rounded" onClick={()=> {setRegister(!register); setIsEdit(false); clearValues() }}>
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
                                    <input type='date' 
                                        className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed" 
                                        value={fechaIni}
                                        onChange={(e) => setFechaIni(e.target.value)}
                                        required
                                    />
                            </div>

                            <div className="mb-4">
                                    <label >HASTA: </label>
                                    <input type='date' 
                                        className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed" 
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                        required
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
                                <span>Mostrando {currentPage === 1 ? 1 : (1+parseInt(perPage))} hasta {perPage * currentPage} de {totalPage} Filas</span>
                            </div>
                            <div className="text-right mt-4">
                                <span className="pr-2">Ver</span>
                                <select className="border border-grey-light" name='perPage' value={perPage} onChange={(e) => onChangePage(e.target.value)}>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        </div>
                        <table className="w-full table-auto text-sm border-t border-grey-light">
                            <thead>
                                <tr className="text-sm leading-normal">
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha del Gasto</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Detalle del Gasto</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Monto</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gastos.map((gasto) => (
                                        <tr key={gasto.id} className="hover:bg-grey-lighter border-b border-grey-light">
                                            <td className="py-2 px-4 border-b border-grey-light">{formatoFecha(gasto.fecha)}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{gasto.descripcion}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{gasto.monto}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                                <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded"
                                                    onClick={()=> handleEdit(gasto)}
                                                >
                                                    <i className='fas fa-edit'></i>
                                                </Link>
                                                <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(gasto.id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    )).slice(firstIndex, lastIndex)
                                }
                                
                            </tbody>
                        </table>

                        <Pagination perPage={perPage} 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage} 
                            totalPage={totalPage} />

                        
                    </div>
                </div>
            )}
        </>
    );
}

export default Gasto;