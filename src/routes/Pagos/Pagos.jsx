import * as React from 'react';
import {  Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import Pagination from '../../components/Pagination/Pagination';
import { createdCobro, deleteCobro, editCobro, getCobros } from '../../services/cobros';
import { getCreditoByDocumento } from '../../services/creditos';

const initialValues = {
    id: 0,
    fecha: "",
    fechalimite: "",
    seriecorrelativo: "",
    numerocorrelativo: "",
    codigogenerado: "",
    tipomoneda: "PEN",
    descripcion_bien: "",
    monto: "",
    interes: "",
    subtotal: "",
    total: "",
    total_texto: "",
    descuento: "",
    montoactual: "",
    user_id: 1,
    tipo_comprobante_id: "",
    servicio_id: "",
    empresa_id: 1,
    tipodocumento: "",
    numerodocumento: "",
    nombrescliente: "",
    direccion: "",
    referencia: "",
    telefono1: "",
    telefono2: "",
    email: "",
    cliente_id: null
};

function Pagos(){
    const [cobros, setCobros] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = cobros.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [register, setRegister] = React.useState(false);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar
    const [responsableId, setResponsableId] = React.useState("");
    const [nroDocumentoFiltro, setNroDocumentoFiltro] = React.useState("");

    const [fechaHoy, setFechaHoy] = React.useState({
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
        const [resultados] = await Promise.all([getCobros(responsableId, fechaIni.startDate, fechafin.startDate, nroDocumentoFiltro)]);
        
        setCobros(resultados);
    }

    async function confirmCreatedCobro(){
        try{
            const response = await createdCobro(formData);
            
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

    async function confirmUpdateCobro(){
        try{
            const response = await editCobro(formData.id, formData);
            
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

    async function confirmDeleteCobro(id){
        try{
            const response = await deleteCobro(id);
        
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

    async function obtenerClienteByNumDoc(){
        const [resultado] = await Promise.all([getCreditoByDocumento(formData.numerodocumento)]);
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdateCobro();
        }else{
            //guardamos
            confirmCreatedCobro();

        }  
    }

    const handleNewEdit = (estado, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        if(datos){
            setFormData({
                id: datos.id,
                fecha: datos.fecha,
                fechalimite: formatoFecha(datos.fechalimite),
                seriecorrelativo: datos.seriecorrelativo,
                numerocorrelativo: datos.numerocorrelativo,
                codigogenerado: datos.codigogenerado,
                tipomoneda: datos.tipomoneda,
                descripcion_bien: datos.descripcion_bien,
                monto: datos.monto,
                interes: datos.interes,
                subtotal: datos.subtotal,
                total: datos.total,
                total_texto: datos.total_texto,
                descuento: datos.descuento,
                montoactual: datos.montoactual,
                tipo_comprobante_id: datos.tipo_comprobante_id,
                servicio_id: datos.servicio_id,
                tipodocumento: datos.tipodocumento,
                numerodocumento: datos.numerodocumento,
                nombrescliente: datos.nombrescliente,
                direccion: datos.direccion?datos.direccion:'',
                referencia: datos.referencia?datos.referencia:'',
                telefono1: datos.telefono1?datos.telefono1:'',
                telefono2: datos.telefono2?datos.telefono2:'',
                email: datos.email?datos.email:'',
                cliente_id: datos.cliente_id?datos.cliente_id:null 
            });

            setFechaHoy({startDate: datos.fecha, endDate: datos.fecha});

        }else{
            let date = new Date();
        
            let fechaActual = date.getFullYear() + "-" + ('0'+(date.getMonth() + 1)).toString().substr(-2) + "-" +('0'+date.getDate()).toString().substr(-2);
            setFechaHoy({startDate: fechaActual, endDate: fechaActual});
            setFormData(initialValues);
            
            setFormData({...formData, fecha: fechaActual});
        }
        
    }

    const handleDelete = (id) => {
        Swal.fire({
            icon: "question",
            title: "Eliminar", 
            text: "¿Desea Eliminar el Crédito?", 
            confirmButtonColor: "#387765",
            confirmButtonText: "Eliminar",
            showDenyButton: true,
            denyButtonText: "Cancelar"
        }).then(response => {
            if(response.isConfirmed){
                confirmDeleteCobro(id);
            }
        });
    }
    
    const onChangePage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    }

    const handleFechaHoyChange = (newValue) => {
        setFechaHoy(newValue); 
        setFormData({ ...formData, fecha: newValue.startDate });
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
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">{estadoRegistro?'EDITAR': 'NUEVO'} PAGO</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="numeroDocumentoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nro. Documento</label>
                                <input type="number" 
                                    id="numeroDocumentoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='numerodocumento'
                                    value={formData.numerodocumento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <button type="button" 
                                    className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto md:mt-7 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"

                                >
                                    <i className='fas fa-search'></i> Buscar
                                </button>
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="nombresclienteTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres y Apellidos del Cliente</label>
                            <input type="text" 
                                id="nombresclienteTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='nombrescliente'
                                value={formData.nombrescliente}
                                required
                                readOnly
                            />
                        </div>
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="totalTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto Total</label>
                                <input type="number" 
                                    id="totalTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='total'
                                    value={formData.total}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="interesTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interés a la Fecha</label>
                                <input type="number" 
                                    id="interesTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='interes'
                                    value={formData.interes}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="totalTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto Total a Pagar</label>
                                <input type="number" 
                                    id="totalTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='total'
                                    value={formData.total}
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="fechaTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha de Pago</label>
                                <Datepicker id="fechaTxt"
                                    inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                    useRange={false} 
                                    asSingle={true} 
                                    value={fechaHoy} 
                                    name='fechaHoy'
                                    onChange={handleFechaHoyChange} 
                                    displayFormat={"DD/MM/YYYY"} 
                                    readOnly
                                    required
                                />

                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="montoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto Recibido</label>
                                <input type="number" 
                                    id="montoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={handleChange}
                                    name='montoRecibido'
                                    value={formData.monto}
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="text-white bg-blue-700 mt-2 mr-1 ml-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <i className='fas fa-save'></i> Guardar
                        </button>
                        <button type="button" className="text-white bg-red-700 mt-2 mr-1 ml-1 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" 
                            onClick={()=> setRegister(!register)}
                        >
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
                            <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Cobros</h2>
                        </div>
                        <div className="my-1"></div> 
                        <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                        <div className='grid grid-cols-1 gap-3'>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="responsableFiltroCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Responsable</label>
                                <select id="responsableFiltroCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='responsableId'
                                    value={responsableId}
                                    onChange={(e) => setResponsableId(e.target.value)}
                                >
                                    <option value="">---</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="mb-4">
                                <label >DE: </label>
                                <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                    useRange={false} 
                                    asSingle={true} 
                                    name='fechaIni'
                                    value={fechaIni} 
                                    onChange={handleFechaIniChange} 
                                    displayFormat={"DD/MM/YYYY"} 
                                    readOnly
                                />
                            </div>

                            <div className="mb-4">
                                <label >HASTA: </label>
                                <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                    useRange={false} 
                                    asSingle={true} 
                                    name='fechafin'
                                    value={fechafin} 
                                    onChange={handleFechaFinChange} 
                                    displayFormat={"DD/MM/YYYY"} 
                                    readOnly
                                />
                            </div>

                            <div className="relative z-0 w-full mb-4 group">
                                <label htmlFor="nroDocumentoFiltroTxt" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Nro. Documento</label>
                                <input type="text" 
                                    id="nroDocumentoFiltroTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='nroDocumentoFiltro'
                                    value={nroDocumentoFiltro}
                                    onChange={(e) => setNroDocumentoFiltro(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 hover:to-indigo-400 text-white font-semibold mt-5 py-3 px-4 rounded" 
                                    onClick={getLista}
                                >
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

export default Pagos;