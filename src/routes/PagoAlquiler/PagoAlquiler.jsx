import * as React from 'react';
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import { createdPagoAlquiler, deletePagoAlquiler, editPagoAlquiler, getPagoAlquileres } from '../../services/pagoAlquiler';
import Pagination from '../../components/Pagination/Pagination';
import { formatoFecha } from '../../util';


const initialValues = {
    id: 0,
    numerooperacion: "",
    fecha: "",
    monto: "",
    descripcion: "",
    tipo_banco_id: "",
    user_id: 1
};

function PagoAlquiler(){

    const [pagoAlquileres, setPagoAlquileres] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = pagoAlquileres.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [register, setRegister] = React.useState(false);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar

    const [fechaPago, setFechaPago] = React.useState({
        startDate: null,
        endDate: null
    });

    const [fechaIni, setFechaIni] = React.useState({
        startDate: null,
        endDate: null
    });

    const [fechafin, setFechafin] = React.useState({
        startDate: null,
        endDate: null
    });
    
    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage; 

    React.useEffect(() => {
        fechaActual();
        setFormData(initialValues);
        getLista();
    }, []);

    const fechaActual = () => {
        let date = new Date();
        let primerDia = new Date(date.getFullYear(), date.getMonth() , 1);
        let ultimoDia = new Date(date.getFullYear(), (date.getMonth() + 1), 0);
        
        let dateIni =  primerDia.getFullYear() + "-" + (primerDia.getMonth() + 1) + "-" + primerDia.getDate();
        let dateFin = ultimoDia.getFullYear() + "-" + (ultimoDia.getMonth() + 1) + "-" + ultimoDia.getDate();

        setFechaIni({startDate: dateIni, endDate: dateIni});
        setFechafin({startDate: dateFin, endDate: dateFin});
    }

    async function getLista(){
        const [resultados] = await Promise.all([getPagoAlquileres(fechaIni.startDate, fechafin.startDate)]);
        
        setPagoAlquileres(resultados);
    }

    async function confirmCreatedPagoAlquiler(){
        try{
            const response = await createdPagoAlquiler(formData);
            
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

    async function confirmUpdatePagoAlquiler(){
        try{
            const response = await editPagoAlquiler(formData.id, formData);
            
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

    async function confirmDeletePagoAlquiler(id){
        try{
            const response = await deletePagoAlquiler(id);
        
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

    function handleChange(event){
        const { name, value } = event.target;
        console.log(event.target)
        setFormData({ ...formData, [name]: value });
    }

    const handleFechaChange = (newValue) => {
        setFechaPago(newValue);
        setFormData({ ...formData, fecha: newValue.startDate });
    } 

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdatePagoAlquiler();
        }else{
            //guardamos
            confirmCreatedPagoAlquiler();

        }  
    }

    const handleNewEdit = (estado, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        if(datos){
            setFormData({
                id: datos.id,
                numerooperacion: datos.numerooperacion,
                fecha: datos.fecha,
                monto: datos.monto,
                descripcion: datos.descripcion?datos.descripcion:'',
                tipo_banco_id: datos.tipo_banco_id
            });

            setFechaPago({startDate: datos.fecha, endDate: datos.fecha});
        }else{
            setFormData(initialValues);
        }
        
    }

    const handleDelete = (id) => {
        Swal.fire({
            icon: "question",
            title: "Eliminar", 
            text: "¿Desea Eliminar la Empresa?", 
            confirmButtonColor: "#387765",
            confirmButtonText: "Eliminar",
            showDenyButton: true,
            denyButtonText: "Cancelar"
        }).then(response => {
            if(response.isConfirmed){
                confirmDeletePagoAlquiler(id);
            }
        });
    }

    const onChangePage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    }
    
    const handleFechaIniChange = (newValue) => {
        setFechaIni(newValue); 
    } 

    const handleFechaFinChange = (newValue) => {
        setFechafin(newValue); 
    } 
    
    return (
        <>
            {register ? (
                <div className="  bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">NUEVO PAGO</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
                        {
                            estadoRegistro && (
                                <input type="hidden" name="id" value={formData.id} />
                            )
                        }
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tipo_banco_idCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Banco <span className='text-red-600'>*</span></label>
                                <select id="tipo_banco_idCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='tipo_banco_id'
                                    value={formData.tipo_banco_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option>---</option>
                                    <option value="1">BANCO DE LA NACION</option>
                                    <option value="2">BANCO DE CREDITO DEL PERU</option>
                                    <option value="3">YAPE/PLIN</option>
                                    <option value="4">EFECTIVO</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="montoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto <span className='text-red-600'>*</span></label>
                                <input type="number" 
                                    id="montoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='monto'
                                    value={formData.monto}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="relative w-full mb-5 group">
                            <label htmlFor="fechaTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha <span className='text-red-600'>*</span></label>
                            <Datepicker id="fechaTxt" inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none z-10 border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                        useRange={false} 
                                        asSingle={true} 
                                        name='fechaPago'
                                        value={fechaPago} 
                                        onChange={handleFechaChange} 
                                        displayFormat={"DD/MM/YYYY"} 
                                        required
                                    />
                            
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="descripcionTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                            <textarea id='descripcionTxt' 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none z-10 border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                name='descripcion'
                                value={formData.descripcion}
                                onChange={handleChange}
                            ></textarea>
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
            ) : (
                <div className='grid grid-cols-1'>
                    <div className="text-right ">
                        <button className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto text-white font-semibold py-2 px-4 rounded" onClick={()=> handleNewEdit(false, null)}>
                            <i className="fas fa-plus-circle"></i> Agregar
                        </button>
                    </div>
                
                    <div className="bg-white p-4 rounded-md mt-4">
                        <div className="grid grid-cols-2">
                            <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista</h2>
                        </div>
                        <div className="my-1"></div> 
                        <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="mb-4">
                                    <label >DE: <span className='text-red-600'>*</span></label>
                                    <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                        useRange={false} 
                                        asSingle={true} 
                                        value={fechaIni} 
                                        onChange={handleFechaIniChange} 
                                        displayFormat={"DD/MM/YYYY"} 
                                        readOnly
                                    />
                            </div>

                            <div className="mb-4">
                                <label >HASTA: <span className='text-red-600'>*</span></label>
                                <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                    useRange={false} 
                                    asSingle={true} 
                                    value={fechafin} 
                                    onChange={handleFechaFinChange} 
                                    displayFormat={"DD/MM/YYYY"} 
                                    readOnly
                                />
                            </div>

                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 hover:to-indigo-400 text-white font-semibold mt-5 py-3 px-4 rounded"
                                    onClick={getLista} >
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
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TIPO BANCO</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">FECHA</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">MONTO</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DESCRIPCION</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Confirmar</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Editar</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pagoAlquileres?.map((pago) => 
                                        (<tr className="hover:bg-grey-lighter" key={pago.id}>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">{pago.nom_tipoBanco}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">{formatoFecha(pago.fecha)}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">{pago.monto}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">{pago.descripcion}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                                <Link className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" ><i className="fas fa-check"></i></Link>
                                            </td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                                <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(true, pago)}><i className="fas fa-edit"></i></Link>
                                            </td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                                <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDelete(pago.id)}><i className="fas fa-trash-alt"></i></Link>
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

export default PagoAlquiler;