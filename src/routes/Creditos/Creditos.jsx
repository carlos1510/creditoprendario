import * as React from 'react';
import { Form, Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import Pagination from '../../components/Pagination/Pagination';
import { formatoFecha } from '../../utils/util';
import Swal from "sweetalert2";
import { createdCredito, deleteCredito, editCredito, getCreditos, getNroComprobante } from '../../services/creditos';
import { numeroALetras } from '../../utils/numeroALetras';
import { getClienteByNroDoc } from '../../services/clientes';
import { getServicios } from '../../services/servicios';

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

function Creditos(){
    const [creditos, setCreditos] = React.useState([]);
    const [servicios, setServicios] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = creditos.length;
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
        obtenerServicios();
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
        const [resultados] = await Promise.all([getCreditos(responsableId, fechaIni.startDate, fechafin.startDate, nroDocumentoFiltro)]);
        
        setCreditos(resultados);
    }

    async function obtenerServicios(){
        const [resultados] = await Promise.all([getServicios()])
        setServicios(resultados);
    }

    async function obtenerClienteByNumDoc() {
        const [resultados] = await Promise.all([getClienteByNroDoc(formData.tipodocumento, formData.numerodocumento)]);
        if(resultados.nombrescliente === ''){
            Swal.fire({
                icon: "warning",
                title: "Advertencia!", 
                text: "Cliente no Encontrado, por favor ingrese manualmente el nombre", 
                timer: 5000
            });
        }else{
            setFormData({...formData, cliente_id: resultados.id?resultados.id:null, nombrescliente: resultados.nombrescliente});
        }
    }

    async function confirmCreatedCredito(){
        try{
            const response = await createdCredito(formData);
            
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

    async function confirmUpdateCredito(){
        try{
            const response = await editCredito(formData.id, formData);
            
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

    async function confirmDeleteCredito(id){
        try{
            const response = await deleteCredito(id);
        
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

    function calcularInteresMonto(event, tipo) {
        let fechaObtenido = "";
        let idServicio = 0;
        let monto_ingresado = 0;
        let interes_calculado = 0;
        let total_monto = 0;

        if(tipo === 1){
            idServicio = event.target.value;
            fechaObtenido = fechaHoy.startDate;
            monto_ingresado = formData.monto;
        }else{
            if(tipo === 2){
                idServicio = formData.servicio_id;
                fechaObtenido = event.startDate;
                monto_ingresado = formData.monto;
            }else{
                if(tipo === 3){
                    idServicio = formData.servicio_id;
                    fechaObtenido = fechaHoy.startDate;
                    monto_ingresado = event.target.value;
                }
            }
        }

        if( !isNaN( parseFloat(monto_ingresado)) && !isNaN(parseInt(idServicio))){
            const [servicio] = servicios.filter(a =>
                parseInt(a.id) === parseInt(idServicio)
            )
    
            if(parseFloat(monto_ingresado) !== ''){
                interes_calculado = (parseFloat(monto_ingresado) * parseFloat(servicio.porcentaje))/100.00;
            }
    
            total_monto = (parseFloat(monto_ingresado) + parseFloat(interes_calculado));
    
            calcularFechaLimite(fechaObtenido, servicio.periodo, servicio.numeroperiodo, total_monto, interes_calculado, servicio.id);
        }
        
    }

    function calcularFechaLimite(fechaObtenido,periodo, numero, total_monto, interes_calculado, servicio_id){
        let fecha = new Date(fechaObtenido);
        let fechagenerado = "";
        if(periodo === 'DIAS'){
            fecha.setDate(fecha.getDate() + parseInt(numero));
            fechagenerado = ('0'+fecha.getDate()).toString().substr(-2)+'/'+('0'+(fecha.getMonth()+1)).toString().substr(-2)+'/'+fecha.getFullYear();
        }else if(periodo === 'SEMANAS'){
            fecha.setDate(fecha.getDate() + (parseInt(numero) * 7));
            fechagenerado = ('0'+fecha.getDate()).toString().substr(-2)+'/'+('0'+(fecha.getMonth()+1)).toString().substr(-2)+'/'+fecha.getFullYear();
        }else if(periodo === 'MES'){
            fecha.setMonth(fecha.getMonth() + parseInt(numero));
            fecha.setDate(fecha.getDate() + 1);
            fechagenerado = ('0'+fecha.getDate()).toString().substr(-2)+'/'+('0'+(fecha.getMonth()+1)).toString().substr(-2)+'/'+fecha.getFullYear();
        }

        setFormData({...formData, total: total_monto, interes: interes_calculado, fechalimite: fechagenerado, servicio_id: servicio_id, total_texto: numeroALetras(total_monto, 'SOLES')});
        
    }

    async function obtenerNroComprobante(event){
        const [resultado] = await Promise.all([getNroComprobante(event.target.value)]);

        console.log(resultado.codigogenerado);

        setFormData({...formData, seriecorrelativo: resultado.seriecorrelativo, numerocorrelativo: resultado.numerocorrelativo, codigogenerado: resultado.codigogenerado, tipo_comprobante_id: event.target.value});
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdateCredito();
        }else{
            //guardamos
            confirmCreatedCredito();

        }  
    }

    const handleNewEdit = (estado, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        if(datos){
            setFormData({
                id: datos.id,
                fechaapertura: formatoFecha(datos.fechaapertura),
                horaapertura: datos.horaapertura,
                montoinicial: datos.montoinicial,
                user_id: datos.user_id
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
            text: "¿Desea Eliminar la Empresa?", 
            confirmButtonColor: "#387765",
            confirmButtonText: "Eliminar",
            showDenyButton: true,
            denyButtonText: "Cancelar"
        }).then(response => {
            if(response.isConfirmed){
                confirmDeleteCredito(id);
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
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">{estadoRegistro?'EDITAR': 'NUEVO'} CREDITO</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit}>
                        {
                            estadoRegistro && (
                                <input type="hidden" name="id" value={formData.id} />
                            )
                        }
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tipo_comprobante_idCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Comprobante <span className='text-red-600'>*</span></label>
                                <select id="tipo_comprobante_idCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='tipo_comprobante_id'
                                    value={formData.tipo_comprobante_id}
                                    onChange={ (event) => {handleChange(event); obtenerNroComprobante(event) }}
                                    required
                                >
                                    <option value="">---</option>
                                    <option value="1">FACTURA</option>
                                    <option value="2">BOLETA</option>
                                    <option value="3">NOTA DE VENTA</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="codigogeneradoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nro. Comprobante <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="codigogeneradoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigogenerado'
                                    value={formData.codigogenerado}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="relative w-full mb-5 group">
                                <label htmlFor="fechaTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha <span className='text-red-600'>*</span></label>
                                <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                    useRange={false} 
                                    asSingle={true} 
                                    value={fechaHoy} 
                                    name='fechaHoy'
                                    onChange={(event) => { handleFechaHoyChange(event); calcularInteresMonto(event, 2)}} 
                                    displayFormat={"DD/MM/YYYY"} 
                                    readOnly
                                    required
                                />
                                
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Documento <span className='text-red-600'>*</span></label>
                                <select id="countries" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='tipodocumento'
                                    value={formData.tipodocumento}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">---</option>
                                    <option value="1">DNI</option>
                                    <option value="2">PASAPORTE / CARNET EXTRANJERIA</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="numerodocumentoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nro. Documento <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="numerodocumentoTxt" 
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
                                    onClick={obtenerClienteByNumDoc}
                                >
                                    <i className='fas fa-search'></i> Buscar
                                </button>
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="nombresclienteTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres del Cliente <span className='text-red-600'>*</span></label>
                            <input type="text" 
                                id="nombresclienteTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='nombrescliente'
                                value={formData.nombrescliente}
                                onChange={handleChange}
                                required    
                            />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="direccionTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dirección del Cliente</label>
                            <input type="text" 
                                id="direccionTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='direccion'
                                value={formData.direccion}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="referenciaTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Referencia</label>
                            <input type="text" 
                                id="referenciaTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='referencia'
                                value={formData.referencia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="telefono1Txt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular 1</label>
                                <input type="number" 
                                    id="telefono1Txt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='telefono1'
                                    value={formData.telefono1}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="telefono2Txt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular 2</label>
                                <input type="number" 
                                    id="telefono2Txt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='telefono2'
                                    value={formData.telefono2}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="emailTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo Electronico</label>
                            <input type="email" 
                                id="emailTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="servicio_idCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Servicio <span className='text-red-600'>*</span></label>
                                <select id="servicio_idCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='servicio_id'
                                    value={formData.servicio_id}
                                    onChange={(event) => { handleChange(event), calcularInteresMonto(event, 1)}}
                                    required 
                                >
                                    <option value="">---</option>
                                    {
                                        servicios?.map((servicio) => (
                                            <option key={servicio.id} value={servicio.id}>{servicio.tiposervicio}</option>
                                        ))
                                    }
                                    
                                    
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="descripcion_bienTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detalle del Bien/Producto <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="descripcion_bienTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='descripcion_bien'
                                    value={formData.descripcion_bien}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tipomonedaCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Moneda <span className='text-red-600'>*</span></label>
                                <select id="tipomonedaCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='tipomoneda'
                                    value={formData.tipomoneda}
                                    onChange={handleChange}
                                    required 
                                >
                                    <option value="">---</option>
                                    <option value="PEN">PEN/SOLES</option>
                                    <option value="DOLAR">DOLAR</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="montoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto <span className='text-red-600'>*</span></label>
                                <input type="input" 
                                    id="montoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='monto'
                                    value={formData.monto}
                                    onChange={handleChange}
                                    onBlur={(event) => calcularInteresMonto(event, 3)}
                                    required 
                                />
                            </div>
                            
                        </div>

                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="interesTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interes <span className='text-red-600'>*</span></label>
                                <input type="input" 
                                    id="interesTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='interes'
                                    value={formData.interes}
                                    onChange={handleChange}
                                    required 
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="totalTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Total <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="totalTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='total'
                                    value={formData.total}
                                    onChange={handleChange}
                                    required 
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="fechalimiteTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fecha Limite <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="fechalimiteTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='fechalimite'
                                    value={formData.fechalimite}
                                    onChange={handleChange}
                                    required 
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="total_textoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Son: <span className='text-red-600'>*</span></label>
                            <input type="text" 
                                id="total_textoTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name='total_texto'
                                value={formData.total_texto}
                                onChange={handleChange}
                                required 
                                readOnly
                            />
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
                    <div className="grid grid-cols-1">
                        <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Creditos</h2>
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
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TIPO DE SERVICIO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DESCRIPCION</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PERIODO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. PERIODO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PORCENTAJE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                creditos?.map((credito) => (
                                    <tr className="hover:bg-grey-lighter" key={credito.id}>
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

export default Creditos;