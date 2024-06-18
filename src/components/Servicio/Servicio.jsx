import * as React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { deleteServicio, editServicio, getServicios, saveServicio } from "../../services/servicios";
import Swal from "sweetalert2";
import Pagination from '../Pagination/Pagination';
import { useTitle } from '../Title/Title';
import { authProvider } from '../../auth';

const initialValues = {
    id: 0,
    tiposervicio: "",
    descripcion: "",
    periodo: "",
    numeroperiodo: "",
    porcentajesocio: "",
    porcentajenegocio: "",
    porcentaje: "",
};

function Servicio(){
    useTitle('Pago Alquiler');
    const [servicios, setServicios] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = servicios.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [register, setRegister] = React.useState(false);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar

    const navigate = useNavigate();
    
    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage;

    React.useEffect(() => {
        setFormData(initialValues);
        getLista();
    }, []);

    async function confirmSaveServicio(){
        try{
            const response = await saveServicio(formData);

            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
            
            setRegister(!register);
            setFormData(initialValues);
            setEstadoRegistro(false);
            Swal.fire({
                icon: "success", 
                title: "Exito!", 
                html: `<p>Se <strong>Actualizó</strong> Correctamente los datos</p>`,
                timer: 3000,
                position: "center"
            });
            getLista();
        }catch(error){
            Swal.fire({
                icon: "error",
                title: "Error!", 
                text: "No se pudo completar con la actualización", 
                timer: 3000
            });
        }
    }

    async function confirmUpdateServicio(){
        try{
            const response = await editServicio(formData.id, formData);

            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
            
            setRegister(!register);
            setFormData(initialValues);
            setEstadoRegistro(false);
            Swal.fire({
                icon: "success", 
                title: "Exito!", 
                html: `<p>Se <strong>Actualizó</strong> Correctamente los datos</p>`,
                timer: 3000,
                position: "center"
            });
            getLista();
        }catch(error){
            Swal.fire({
                icon: "error",
                title: "Error!", 
                text: "No se pudo completar con la actualización", 
                timer: 3000
            });
        }
    }

    async function confirmDeleteServicio(id){
        try{
            const response = await deleteServicio(id);

            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
        
            Swal.fire('Exito', 'El registro se eliminó correctamente');
            getLista();
        }catch(error){
            Swal.fire({
                icon: "error",
                title: "Error!", 
                text: "No se pudo completar con la actualización", 
                timer: 3000
            });
        }
    }

    async function getLista(){
        const [resultados] = await Promise.all([getServicios()]);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }
        
        setServicios(resultados);
    }

    const handlePorcentajeTotal = () => {
        if( !isNaN( parseFloat(formData.porcentajesocio)) && !isNaN(parseInt(formData.porcentajenegocio))){
            const porcentajeTotal = parseFloat(formData.porcentajesocio) + parseInt(formData.porcentajenegocio);
            setFormData({ ...formData, porcentaje: porcentajeTotal });
        }
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdateServicio();
        }else{
            //guardamos
            confirmSaveServicio();

        }  
    }

    const handleNewEdit = (estado, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        if(datos){
            setFormData({
                id: datos.id,
                tiposervicio: datos.tiposervicio,
                descripcion: datos.descripcion?datos.descripcion:'',
                periodo: datos.periodo,
                numeroperiodo: datos.numeroperiodo,
                porcentajesocio: datos.porcentajesocio,
                porcentajenegocio: datos.porcentajenegocio,
                porcentaje: datos.porcentaje,
            });
        }else{
            setFormData(initialValues);
        }
        
    }

    const handleDelete = (id) => {
        Swal.fire({
            icon: "question",
            title: "Eliminar", 
            text: "¿Desea Eliminar el Servicio?", 
            confirmButtonColor: "#387765",
            confirmButtonText: "Eliminar",
            showDenyButton: true,
            denyButtonText: "Cancelar"
        }).then(response => {
            if(response.isConfirmed){
                confirmDeleteServicio(id);
            }
        });
    }

    const onChangePage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    }

    return (
        <>
        {register ? (
            <div className="bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                <h2 className="text-gray-500 text-lg font-semibold pb-4">{estadoRegistro?'EDITAR': 'REGISTRAR'} SERVICIO</h2>
                <div className="my-1"></div> 
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                <form onSubmit={handleSubmit} >
                    {
                        estadoRegistro && (
                            <input type="hidden" name="id" value={formData.id} />
                        )
                    }
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="ml-2 mr-2 col-span-4 md:col-span-1 sm:col-span-4">
                            <label htmlFor="" className='text-lg'>TIPO DE SERVICIO </label><span className='text-red-600'>*</span>
                            <input type="text" 
                                className="w-full px-3 py-2 uppercase dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                name='tiposervicio'
                                value={formData.tiposervicio} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="" className='text-lg'>PERIODO </label><span className='text-red-600'>*</span>
                            <select className="w-full px-3 text-lg py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                value={formData.periodo}
                                onChange={handleChange}
                                name='periodo'
                                required
                            >
                                <option value="">---</option>
                                <option value="DIAS">DIAS</option>
                                <option value="SEMANAS">SEMANAS</option>
                                <option value="MES">MES</option>
                            </select>
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="" className='text-lg'>NUMERO DEL PERIODO </label> <span className='text-red-600'>*</span>
                            <input type="number" 
                                className="w-full px-3 py-2 text-lg dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                name='numeroperiodo'
                                value={formData.numeroperiodo} 
                                onChange={handleChange} 
                                required
                                />
                        </div>
                        
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="ml-2 mr-2">
                            <label htmlFor="" className='text-lg'>PORCENTAJE SOCIO </label> <span className='text-red-600'>*</span>
                            <input type="number" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                name='porcentajesocio'
                                value={formData.porcentajesocio} 
                                onChange={handleChange}
                                onBlur={handlePorcentajeTotal}
                                required
                            />
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="" className='text-lg'>PORCENTAJE NEGOCIO</label> <span className='text-red-600'>*</span>
                            <input type="number" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                name='porcentajenegocio'
                                value={formData.porcentajenegocio} 
                                onChange={handleChange}
                                onBlur={handlePorcentajeTotal}
                                required
                            />
                        </div>
                        <div className="ml-2 mr-2">
                            <label htmlFor="" className='text-lg'>PORCENTAJE TOTAL</label> <span className='text-red-600'>*</span>
                            <input type="number" 
                                className="bg-gray-50 w-full text-lg px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                name='porcentaje'
                                value={formData.porcentaje} 
                                required
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 ">
                        <div className="ml-2 mr-2 pt-5">
                            <label htmlFor="" className='text-lg'>DESCRIPCION</label>
                            <textarea  
                                className="w-full px-3 py-2 text-lg dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid " 
                                name='descripcion'
                                value={formData.descripcion} 
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        
                    </div>
                    
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    
                    <div className="grid grid-cols-2">
                        <div className="text-left">
                            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded ">
                                <i className="fas fa-save"></i> Guardar
                            </button>
                        </div>
                        <div className="text-right">
                            <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded  " onClick={()=> setRegister(!register)}>
                                <i className="fas fa-times"></i> Salir
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
            :
        (
            <div className='grid grid-cols-1'>
                    <div className="text-right ">
                        <button className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto text-white font-semibold py-2 px-4 rounded" onClick={()=> handleNewEdit(false, null)}>
                            <i className="fas fa-plus-circle"></i> Agregar
                        </button>
                    </div>
            <div className="bg-white p-4 rounded-md mt-4">
                <div className="grid grid-cols-1">
                    <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Servicios</h2>
                    
                </div>
                <div className="my-1"></div> 
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                
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
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TIPO DE SERVICIO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DESCRIPCION</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PERIODO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. PERIODO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PORCENTAJE</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Editar</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            servicios?.map((servicio) => 
                                (<tr className="hover:bg-grey-lighter" key={servicio.id}>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{servicio.tiposervicio}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{servicio.descripcion}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{servicio.periodo}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{servicio.numeroperiodo}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{servicio.porcentaje}%</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">
                                    <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(true, servicio)}><i className="fas fa-edit"></i></Link>
                                    </td>
                                    
                                    <td className="py-2 px-4 border-b border-grey-light text-center">
                                        <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDelete(servicio.id)}><i className="fas fa-trash-alt"></i></Link>
                                    </td>

                                </tr>)
                            ).slice(firstIndex, lastIndex)
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

export default Servicio;