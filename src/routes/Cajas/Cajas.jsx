import * as React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import './style.css';
import Pagination from '../../components/Pagination/Pagination';
import { formatoFecha } from '../../utils/util';
import Swal from "sweetalert2";
import { cerrarCaja, createdCaja, deleteCaja, editCaja, getCajas, getCierraCaja, getUltimoCierreMonto, obtenerAperturaCaja } from '../../services/caja';
import { useTitle } from '../../components/Title/Title';
import { getUsuariosByEmpresa } from '../../services/usuarios';
import { authProvider } from "../../auth";

const initialValues = {
    id: 0,
    fechaapertura: "",
    horaapertura: "",
    montoinicial: "",
    fechacierre: "",
    horacierre: "",
    montocobro: "",
    montocredito: "",
    montogasto: "",
    montocierre: "",
    user_id: "",
    responsable: "",
    interessocio: "",
    interesnegocio: "",
    totalcapital: ""
};

function Cajas(){
    useTitle('Caja');
    const [cajas, setCajas] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = cajas.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [register, setRegister] = React.useState(false);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar
    const [estadoCierre, setEstadoCierre] = React.useState(false);
    const [estadoApertura, setEstadoApertura] = React.useState(-1);
    const navigate = useNavigate();

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
        verificarAperturaExistente();
        fechaActual();
        setFormData(initialValues);
        getResponsables();
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
        const [resultados] = await Promise.all([getCajas(fechaIni.startDate, fechafin.startDate)]);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }
        
        setCajas(resultados);
    }

    async function getResponsables(){
        const [resultados] = await Promise.all([getUsuariosByEmpresa()]);
        setUsers(resultados);
    }

    async function getMontosCierreCaja(datos){
        let date = new Date();
            
        let fechaActual = ('0'+date.getDate()).toString().substr(-2) + "/" + ('0'+(date.getMonth() + 1)).toString().substr(-2) + "/" + date.getFullYear();
        let horaActual = ('0'+date.getHours()).toString().substr(-2) + ":" + ('0'+date.getMinutes()).toString().substr(-2) + ":" + ('0'+date.getSeconds()).toString().substr(-2);
        const [user] = users.filter(a =>
            parseInt(a.id) === parseInt(datos.user_id)
        )

        const [resultados] = await Promise.all([getCierraCaja(datos.id)]);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }

        setFormData({...formData, 
            id: datos.id,
            fechaapertura: formatoFecha(datos.fechaapertura),
            horaapertura: datos.horaapertura,
            montoinicial: datos.montoinicial,
            fechacierre: fechaActual,
            horacierre: horaActual,
            user_id: datos.user_id,
            responsable: user.nombres + " " + user.apellidos,
            montocobro: resultados.montocobro, 
            montocredito:resultados.montocredito, 
            montogasto: resultados.montogasto,
            montocierre:resultados.montocierre,
            interessocio: resultados.interessocio,
            interesnegocio: resultados.interesnegocio,
            totalcapital: resultados.totalcapital
        });
    }

    async function verificarAperturaExistente(){
        const [resultados] = await Promise.all([obtenerAperturaCaja()]);
        setEstadoApertura(resultados.apertura_activo);
    }

    async function confirmCreatedCaja(){
        try{
            const response = await createdCaja(formData);

            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
            
            verificarAperturaExistente();
            setRegister(!register);
            setFormData(initialValues);
            setEstadoRegistro(false);
            Swal.fire({
                icon: "success", 
                title: "Exito!", 
                html: `<p>Se <strong>Registro</strong> Correctamente los datos</p>`,
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

    async function confirmUpdateCaja(){
        try{
            const response = await editCaja(formData.id, formData);

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

    async function confirmDeleteCaja(id){
        try{
            const response = await deleteCaja(id);

            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
        
            Swal.fire('Exito', 'El registro se eliminó correctamente');
            verificarAperturaExistente();
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

    async function confirmCierreCaja(){
        try{
            const response = await cerrarCaja(formData);

            if(response === 401){
                authProvider.logoutStorage();
                navigate("/login");
            }
            
            setRegister(!register);
            setFormData(initialValues);
            setEstadoRegistro(false);
            setEstadoCierre(false);
            verificarAperturaExistente();
            Swal.fire({
                icon: "success", 
                title: "Exito!", 
                html: `<p>Se <strong>Cerro Caja</strong> Correctamente</p>`,
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

    async function obtenerUltimoCierreMonto(event){
        const [resultado] = await Promise.all([getUltimoCierreMonto(event.target.value)]);
        
        if(resultado === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }

        setFormData({...formData, montoinicial: resultado.montocierre, user_id: event.target.value});
        //setUltimoCierreMonto(value);
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdateCaja();
        }else{
            //guardamos
            confirmCreatedCaja();

        }  
    }

    const handleCierreSubmit = (event) => {
        event.preventDefault();
        confirmCierreCaja();
    }

    const handleNewEdit = (estado, estado2, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        setEstadoCierre(estado2);
        console.log(estado2);
        if(estado2){
            getMontosCierreCaja(datos); // obtenemos los datos para el cierre de caja
        }else{
            if(datos){
                setFormData({
                    id: datos.id,
                    fechaapertura: formatoFecha(datos.fechaapertura),
                    horaapertura: datos.horaapertura,
                    montoinicial: datos.montoinicial,
                    user_id: datos.user_id
                });
    
            }else{
                let date = new Date();
            
                let fechaActual = ('0'+date.getDate()).toString().substr(-2) + "/" + ('0'+(date.getMonth() + 1)).toString().substr(-2) + "/" + date.getFullYear();
                let horaActual = ('0'+date.getHours()).toString().substr(-2) + ":" + ('0'+date.getMinutes()).toString().substr(-2) + ":" + ('0'+date.getSeconds()).toString().substr(-2);
                setFormData(initialValues);
                setFormData({ ...formData, fechaapertura: fechaActual, horaapertura: horaActual });
            }
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
                confirmDeleteCaja(id);
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
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">{estadoCierre?'CIERRE':'APERTURA'} DE CAJA</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    {
                        estadoCierre ? (
                            <form className="max-w-lg mx-auto" onSubmit={handleCierreSubmit}>
                                
                                <div className='relative z-0 w-full mb-5 group'>
                                <input type="text" 
                                            id="responsableTxt"
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="responsable" 
                                            value={formData.responsable}
                                            readOnly
                                        />
                                        <label htmlFor="responsableTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Responsable</label>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="fechaAperturaTxt"
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="fechaapertura" 
                                            value={formData.fechaapertura}
                      
                                            readOnly
                                        />
                                        <label htmlFor="fechaAperturaTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de Apertura</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="horaAperturaTxt" 
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="horaapertura" 
                                            value={formData.horaapertura}

                                            readOnly
                                        />
                                        <label htmlFor="horaAperturaTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Hora de Apertura</label>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="fechaCierreTxt"
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="fechacierre" 
                                            value={formData.fechacierre}
                                            readOnly
                                        />
                                        <label htmlFor="fechaCierreTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de Cierre</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="horaCierreTxt" 
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="horacierre" 
                                            value={formData.horacierre}
                                            readOnly
                                        />
                                        <label htmlFor="horaCierreTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Hora de Cierre</label>
                                    </div>
                                </div>

                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="number" 
                                        id="montoInicialTxt" 
                                        className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                        placeholder=" " 
                                        name='montoinicial'
                                        value={formData.montoinicial}
                                        readOnly 
                                    />
                                    <label htmlFor="montoInicialTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Monto Inicial</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="number" 
                                        id="montocreditoTxt" 
                                        className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                        placeholder=" " 
                                        name='montocredito'
                                        value={formData.montocredito}
                                        readOnly 
                                    />
                                    <label htmlFor="montocreditoTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Creditos</label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="number" 
                                        id="montogastoTxt" 
                                        className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                        placeholder=" " 
                                        name='montogasto'
                                        value={formData.montogasto}
                                        readOnly 
                                    />
                                    <label htmlFor="montogastoTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Gastos</label>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="interessocioTxt"
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="interessocio" 
                                            value={formData.interessocio}
                                            readOnly
                                        />
                                        <label htmlFor="interessocioTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cobros Intereses Socio</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="interesnegocioTxt" 
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="interesnegocio" 
                                            value={formData.interesnegocio}
                                            readOnly
                                        />
                                        <label htmlFor="interesnegocioTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cobros Intereses Negocio</label>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="totalcapitalTxt"
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="totalcapital" 
                                            value={formData.totalcapital}
                                            readOnly
                                        />
                                        <label htmlFor="totalcapitalTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Cobro Capital</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="number" 
                                            id="montocobroTxt" 
                                            className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" " 
                                            name='montocobro'
                                            value={formData.montocobro}
                                            readOnly 
                                        />
                                        <label htmlFor="montocobroTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Cobros</label>
                                    </div>
                                </div>
                                
                                
                               
                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="number" 
                                        id="montoCierreTxt" 
                                        className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                        placeholder=" " 
                                        name='montocierre'
                                        value={formData.montocierre}
                                        readOnly 
                                    />
                                    <label htmlFor="montoCierreTxt" className="peer-focus:font-medium absolute text-xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Total Monto de Cierre</label>
                                </div>
                                <button type="submit" className="text-white bg-blue-700 mt-2 mr-1 ml-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <i className='fas fa-save'></i> Guardar
                                </button>
                                <button type="button" className="text-white bg-red-700 mt-2 mr-1 ml-1 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" 
                                onClick={()=> setRegister(!register)}>
                                    <i className='fas fa-times'></i> Salir
                                </button>
                            </form> 
                        ): 
                        (
                            <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
                                {
                                    estadoRegistro && (
                                        <input type="hidden" name="id" value={formData.id} />
                                    )
                                }
                                <div className='relative z-0 w-full mb-5 group'>
                                    <label htmlFor="cmbResponsable" >Responsable de la Caja</label>
                                    <select id='cmbResponsable' 
                                        className="block  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                        name='user_id'
                                        value={formData.user_id}  
                                        onChange={ (event) => {handleChange(event); obtenerUltimoCierreMonto(event) }}  
                                        required
                                    >
                                        <option value="">---</option>
                                        {
                                            users?.map((user) => (
                                                <option key={user.id} value={user.id}>{user.nombres} {user.apellidos}</option>
                                            ))
                                        }
                                    </select>
                                    
                                </div>
                                <div className="grid md:grid-cols-2 md:gap-6">
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="fechaAperturaTxt"
                                            className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="fechaapertura" 
                                            value={formData.fechaapertura}
                                            readOnly
                                        />
                                        <label htmlFor="fechaAperturaTxt" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de Apertura</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <input type="text" 
                                            id="horaAperturaTxt" 
                                            className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                            placeholder=" "
                                            name="horaapertura" 
                                            value={formData.horaapertura}
                                            readOnly
                                        />
                                        <label htmlFor="horaAperturaTxt" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Hora de Apertura</label>
                                    </div>
                                </div>

                                <div className="relative z-0 w-full mb-5 group">
                                    <input type="number" 
                                        id="montoInicialTxt" 
                                        className="block py-2.5 px-0 w-full  text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                                        placeholder=" " 
                                        name='montoinicial'
                                        value={formData.montoinicial}
                                        onChange={handleChange}
                                        required 
                                    />
                                    <label htmlFor="montoInicialTxt" className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Monto Inicial</label>
                                </div>
                                <button type="submit" className="text-white bg-blue-700 mt-2 mr-1 ml-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <i className='fas fa-save'></i> Guardar
                                </button>
                                <button type="button" className="text-white bg-red-700 mt-2 mr-1 ml-1 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" 
                                onClick={()=> setRegister(!register)}>
                                    <i className='fas fa-times'></i> Salir
                                </button>
                            </form> 
                        )
                    }
                </div>
            ) 
            : 
            (
                <div className="bg-white p-4 rounded-md mt-4">
                    <div className="grid grid-cols-2">
                        <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Caja</h2>
                        {
                            estadoApertura===-1?(
                                <div className="text-right">
                                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded" onClick={()=> handleNewEdit(false, false, null)}>
                                        <i className="fas fa-unlock"></i> Aperturar Caja
                                    </button>
                                </div>
                            ):("")
                        }
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
                    <table className="w-full table-auto  border-t border-grey-light">
                        <thead>
                            <tr className=" leading-normal">
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light">RESPONSABLE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light">FECHA Y HORA APERTURA</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light">MONTO INICIAL</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light">FECHA Y HORA CIERRE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light">MONTO SOCIO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light">MONTO CIERRE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light text-right">Cerrar Caja</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light text-center">Editar</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase  text-grey-light border-b border-grey-light text-center">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cajas?.map((caja) => 
                                    (<tr className="hover:bg-grey-lighter" key={caja.id}>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{caja.nombres}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{formatoFecha(caja.fechaapertura)} {caja.horaapertura}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-right">S/. {caja.montoinicial}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{caja.fechacierre!==null?formatoFecha(caja.fechacierre):''} {caja.horacierre}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-right">S/. {caja.interessocio!==null?(caja.interessocio).toFixed(2):0.00}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-right">S/. {caja.montocierre!==null?(caja.montocierre).toFixed(2):0.00}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            {
                                                caja.estado!==2?(
                                                    <Link className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleNewEdit(true, true, caja )} ><i className="fas fa-lock"></i></Link>
                                                ): ('')
                                            }
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            {
                                                caja.estado!==2? (
                                                    <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(true, false, caja)}><i className="fas fa-edit"></i></Link>
                                                ):('')
                                            }
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            {
                                                (authProvider.rol === 'Administrador' || authProvider.rol === 'SubAdministrador') ?
                                                (
                                                    caja.estado!==2?(
                                                        <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDelete(caja.id)}><i className="fas fa-trash-alt"></i></Link>
                                                    ):("")
                                                ): ""
                                            }
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
            )}
        </>
    );
}

export default Cajas;