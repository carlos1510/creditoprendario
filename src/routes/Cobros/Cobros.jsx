import * as React from 'react';
import {  Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import Pagination from '../../components/Pagination/Pagination';
import { getCreditoByDocumento } from '../../services/creditos';
import { formatoFecha } from '../../utils/util';
import { createdCobro, getNroComprobantePago, getNumeroPago } from '../../services/cobros';
import Swal from 'sweetalert2';
import { useTitle } from '../../components/Title/Title';
import { obtenerAperturaCaja } from '../../services/caja';
import ticket from '../../utils/ticket';
import { numeroALetras } from '../../utils/numeroALetras';

const initialValues = {
    id: 0,
    fechavencimientoanterior: "",
    monto: "",
    interes: "",
    total: "",
    numerodocumento: "",
    nombrescliente: "",
    user_id: 1,
    fecha: "",
    capital: "",
    empresa_id: 1,
    credito_id: "1",
    seriecorrelativo: "",
    numerocorrelativo: "",
    codigogenerado: "",
    tipo_comprobante_id: "",
    codigocredito: "",
    codigocontrato: "",
    montorestante: "",
    igv: "",
    interes_socio: "",
    interes_negocio: "",
    totalinteressocio: "",
    nro_dias: "",
    tiposervicio:"",
    numeropago: "",
    codigopago:"",
    plazo: "",
};

function Cobros(){

    useTitle('Cobros');
    const [cobros, setCobros] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = cobros.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [register, setRegister] = React.useState(false);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar
    const [nroDocumentoFiltro, setNroDocumentoFiltro] = React.useState("");
    const [estadoApertura, setEstadoApertura] = React.useState(-1);

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
        //fechaActual();
        verificarAperturaExistente();
        setFormData(initialValues);
        
        //getLista();
    }, []);

    //INICIO PARA TICKET
    const onGenerateTicket = async (output, data) => {

        const content = [
            { text: '' + data.nombrenegocio?data.nombrenegocio:'', style: 'header', margin: [0, 10, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },
            { text: '' + data.nombre_empresa, style: 'text' },
            { text: '' + data.direccion_empresa, style: 'text' },
            { text: '' + data.descripcion_tipo_doc_empresa + ': ' + data.nrodoc_empresa, style: 'text' },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },

            //TIPO Y NUMERO DOCUMENTO
            { text: '' + data.nom_tipo_comprobante, style: 'header', margin: [0, 5, 0, 2.25] },
            { text: '' + data.codigogenerado, style: 'header', margin: [0, 2.25, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },

            //DATOS CEBECERA FACTURAR
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['25%', '35%', '15%', '25%'],
                    body: [
                        [
                            { text: 'CAJERO:', style: 'tHeaderLabel' },
                            { text: '' + data.nombres_cajero, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'FECHA:', style: 'tHeaderLabel' },
                            { text: '' + formatoFecha(data.fecha), style: 'tHeaderValue' },
                            { text: 'HORA:', style: 'tHeaderLabel' },
                            { text: '' + data.hora, style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'OPERACION:', style: 'tHeaderLabel' },
                            { text: '' + data.codigopago, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'CLIENTE:', style: 'tHeaderLabel' },
                            { text: '' + data.nombrescliente, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'DNI:', style: 'tHeaderLabel' },
                            { text: '' + data.nrodoc_cliente, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'N° CREDITO:', style: 'tHeaderLabel' },
                            { text: '' + data.codigocredito, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            //TABLA SERVICIO
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['35%', '25%', '15%', '25%'],
                    body: [
                            [
                                {
                                    text: 'PRODUCTO: ',
                                    style: 'tTotals',
                                    alignment: 'left',
                                    colSpan: 4,
                                    margin: [5, 3, 0, 0],
                                },
                                {},
                                {},
                                {},
                            ],
                            [
                                { text: '' + data.tiposervicio, style: 'tProductsBody', colSpan: 4, margin: [5, 0, 0, 0] },
                                {},
                                {},
                                {},
                            ],
                        ],
                },
                layout: 'noBorders',
            },
            //TOTALES
            {
                margin: [0, 10, 0, 0],
                table: {
                  widths: ['25%', '35%', '15%', '25%'],
                  body: [
                    
                    [
                        { text: 'PRESTAMO', style: 'tTotals', alignment: 'left',colSpan: 2, margin: [5, 0, 0, 0], },
                        {},
                        {text: 'S/:', alignment: 'left', style: 'tTotals'},
                        { text: '' + (data.capital).toFixed(2), alignment: 'left',style: 'tTotals' },
                    ],
                    [
                      { text: 'INTERÉS: S/', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + (data.interes_negocio).toFixed(2), style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    [
                      { text: 'TOTAL PAGO: S/', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + ((data.capital + data.interes_negocio)).toFixed(2), style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    [
                        { text: 'DÍAS TRANS.: ', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                        {},
                        { text: '' + data.nro_dias + ' días', style: 'tTotals', colSpan: 2 },
                        {},
                    ],
                    //TOTAL IMPORTE EN LETRAS
                  ],
                },
                layout: 'noBorders',
            },
            { text: '------------------------------------------------------------------------------------------------', style: 'text' },
            // DATOS DE LA RENOVACION
            {
                margin: [0, 10, 0, 0],
                table: {
                  widths: ['25%', '35%', '15%', '25%'],
                  body: [
                    
                    [
                        { text: 'NUEVO SALDO CAP S/:', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                        {},
                        { text: '' + (data.nuevocapital?data.nuevocapital:0).toFixed(2), style: 'tTotals', colSpan: 2  },
                        {},
                        
                    ],
                    [
                      { text: 'FECHA PRÓX VCTO : ', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + data.fechavencimientonuevo!=='null'?formatoFecha(data.fechavencimientonuevo):'', style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    [
                      { text: 'PLAZO: ', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + data.plazo, style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    
                  ],
                },
                layout: 'noBorders',
            },
            
            //NOTA DE PIE
            {
                text: 'ESTE DOCUMENTO NO ES UN TICKET BAJO REGLAMENTO DE COMPROBANTE DE PAGO.',
                style: 'text',
                alignment: 'justify',
                margin: [5, 15, 10, 0],
            },
        ];

        const response = await ticket(output, '', content);
        
        if (!response?.success) {
            alert(response?.message);
            return;
        }
    };

    const onGenerateTicketSocio = async (output, data) => {

        const content = [
            { text: '' + data.nombrenegocio?data.nombrenegocio:'', style: 'header', margin: [0, 10, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },
            { text: '' + data.nombre_empresa, style: 'text' },
            { text: '' + data.direccion_empresa, style: 'text' },
            { text: '' + data.descripcion_tipo_doc_empresa + ': ' + data.nrodoc_empresa, style: 'text' },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },

            //TIPO Y NUMERO DOCUMENTO
            { text: '' + data.nom_tipo_comprobante, style: 'header', margin: [0, 5, 0, 2.25] },
            { text: '' + data.codigogenerado, style: 'header', margin: [0, 2.25, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },

            //DATOS CEBECERA FACTURAR
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['25%', '35%', '15%', '25%'],
                    body: [
                        [
                            { text: 'CAJERO:', style: 'tHeaderLabel' },
                            { text: '' + data.nombres_cajero, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'FECHA:', style: 'tHeaderLabel' },
                            { text: '' + formatoFecha(data.fecha), style: 'tHeaderValue' },
                            { text: 'HORA:', style: 'tHeaderLabel' },
                            { text: '' + data.hora, style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'OPERACION:', style: 'tHeaderLabel' },
                            { text: '' + data.codigopago, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'CLIENTE:', style: 'tHeaderLabel' },
                            { text: '' + data.nombrescliente, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        [
                            { text: 'DNI:', style: 'tHeaderLabel' },
                            { text: '' + data.nrodoc_cliente, style: 'tHeaderValue', colSpan: 3 },
                            {},
                            {},
                        ],
                        
                        [
                            { text: 'N° CONTRATO:', style: 'tTotals', alignment: 'left', colSpan: 2, margin: [10, 6, 0, 0] },
                            {},
                            { text: '' + data.codigocontrato, style: 'tHeaderValue', alignment: 'left', colSpan: 2, margin: [0, 6, 0, 0] },
                            {},
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            //TABLA SERVICIO
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['35%', '25%', '15%', '25%'],
                    body: [
                            [
                                {
                                    text: 'PRODUCTO: ',
                                    style: 'tTotals',
                                    alignment: 'left',
                                    colSpan: 4,
                                    margin: [5, 6, 0, 0],
                                },
                                {},
                                {},
                                {},
                            ],
                            [
                                { text: '' + data.tiposervicio, style: 'tProductsBody', colSpan: 4, margin: [5, 0, 0, 0] },
                                {},
                                {},
                                {},
                            ],
                            
                        ],
                },
                layout: 'noBorders',
            },
            { text: '----------------------------------------------------------------------------------------------', style: 'text' },
            {
                margin: [0, 10, 0, 0],
                table: {
                  widths: ['25%', '35%', '15%', '25%'],
                  body: [
                    //TOTALES
                    [
                      { text: 'IMPORTE: S/', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + (data.interes_socio).toFixed(2), style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    [
                      { text: 'IGV: S/', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + (0).toFixed(2), style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    [
                      { text: 'TOTAL PAGO: S/', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      { text: '' + (data.interes_socio).toFixed(2), style: 'tTotals', colSpan: 2 },
                      {},
                    ],
                    [
                        { text: 'DÍAS TRANS: S/', style: 'tTotals', colSpan: 2, margin: [5, 0, 0, 0], },
                        {},
                        { text: '' + data.nro_dias, style: 'tTotals', colSpan: 2 },
                        {},
                    ],
                    
                  ],
                },
                layout: 'noBorders',
            },
            { text: '----------------------------------------------------------------------------------------------', style: 'text' },
            //NOTA DE PIE
            {
                text: 'ESTE DOCUMENTO NO ES UN TICKET BAJO REGLAMENTO DE COMPROBANTE DE PAGO.',
                style: 'text',
                alignment: 'justify',
                margin: [5, 15, 10, 0],
            },
        ];

        const response = await ticket(output, '_blank', content);
        if (!response?.success) {
            alert(response?.message);
            return;
        }
    }
    // fin para ticket

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
        const [resultados] = await Promise.all([getCreditoByDocumento(fechaIni.startDate, fechafin.startDate, nroDocumentoFiltro)]);
        
        setCobros(resultados);
    }

    async function verificarAperturaExistente(){
        const [resultados] = await Promise.all([obtenerAperturaCaja()]);
        setEstadoApertura(resultados.apertura_activo);
    }

    async function confirmCreatedCobro(){
        try{
            const response = await createdCobro(formData);
            
            onGenerateTicket('print', response);

            onGenerateTicketSocio('print', response);
            
            setRegister(!register);
            setFormData(initialValues);
            setEstadoRegistro(false);
            Swal.fire({
                icon: "success", 
                title: "Exito!", 
                html: `<p>Se <strong>Registro</strong> Correctamente el Pago</p>`,
                timer: 3000,
                position: "center"
            });
            getLista();
        }catch(error){
            Swal.fire({
                icon: "error",
                title: "Error!", 
                text: "No se pudo completar con el registro", 
                timer: 3000
            });
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
            //confirmUpdateCobro();
        }else{
            //guardamos
            confirmCreatedCobro();
        }  
    }

    const handleNewEdit = (datos) => {
        
        setRegister(!register);
        let date = new Date();
        
        let fechaActual = date.getFullYear() + "-" + ('0'+(date.getMonth() + 1)).toString().substr(-2) + "-" +('0'+date.getDate()).toString().substr(-2);

        setFechaHoy({startDate: fechaActual, endDate: fechaActual});
        if(datos){
            obtenerNroPago(datos, fechaActual);
        }
    }

    const obtenerNroPago = async (datos, fechaActual) =>{
        const [resultado] = await Promise.all([getNumeroPago()]);

        setFormData({
            id: 0,
            fechavencimientoanterior: formatoFecha(datos.fechalimite),
            monto: "",
            interes: (datos.interes_negocio + datos.interes_socio),
            total: (datos.interes_negocio + datos.interes_socio + datos.monto),
            numerodocumento: datos.numerodocumento,
            nombrescliente: datos.nombrescliente,
            user_id: 1,
            fecha: fechaActual,
            capital: datos.monto,
            empresa_id: 1,
            credito_id: datos.id,
            seriecorrelativo: "",
            numerocorrelativo: "",
            codigogenerado: "",
            tipo_comprobante_id: "",
            codigocredito: datos.codigocredito,
            codigocontrato: datos.codigocontrato,
            montorestante: "",
            igv: 0,
            interes_socio: datos.interes_socio,
            interes_negocio: datos.interes_negocio,
            totalinteressocio: (datos.interes_socio + 0),
            nro_dias: datos.nro_dias,
            tiposervicio: datos.tiposervicio,
            plazo: datos.plazo,
            numeropago: resultado.numeropago, codigopago: resultado.codigopago
        });
    }

    async function obtenerNroComprobante(event){
        const [resultado] = await Promise.all([getNroComprobantePago(event.target.value)]);

        setFormData({...formData, seriecorrelativo: resultado.seriecorrelativo, numerocorrelativo: resultado.numerocorrelativo, codigogenerado: resultado.codigogenerado, tipo_comprobante_id: event.target.value});
    }

    const handleCalcularMontoRestante = (event) => {
        let monto_restante = 0;
        if(!isNaN( parseFloat(formData.monto))){
            monto_restante = (parseFloat(formData.total) - parseFloat(formData.monto)).toFixed(2);
            setFormData({...formData, montorestante: monto_restante});
        }
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
            {
                estadoApertura !== 0?(
                    <div className=' space-y-6'>
                        <div className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3" role="alert">
                            <p className="font-bold">Información de Apertura de Caja</p>
                            <p className="text-sm">
                                Debe Aperturar Caja para poder Realizar el Registro de Creditos
                            </p>
                        </div>
                    </div>
                ):""           
            }
            
            {register ? (
                <div className="  bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">Registrar PAGO</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tipo_comprobante_idCmb" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Tipo de Comprobante <span className='text-red-600'>*</span></label>
                                <select id="tipo_comprobante_idCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='tipo_comprobante_id'
                                    value={formData.tipo_comprobante_id || ''}
                                    onChange={ (event) => {handleChange(event); obtenerNroComprobante(event) }}
                                    required
                                >
                                    <option value="">---</option>
                                    <option value="1">FACTURA</option>
                                    <option value="2">BOLETA</option>
                                    <option value="4">NOTA DE PAGO</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="codigogeneradoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Comprobante <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="codigogeneradoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigogenerado'
                                    value={formData.codigogenerado || ''}
                                    
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="codigopagoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Operación <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="codigopagoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigopago'
                                    value={formData.codigopago}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="codigocreditoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">N° CREDITO</label>
                                <input type="text" 
                                    id="codigocreditoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='codigocredito'
                                    value={formData.codigocredito}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="codigocontratoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">N° CONTRATO</label>
                                <input type="text" 
                                    id="codigocontratoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigocontrato'
                                    value={formData.codigocontrato}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="numeroDocumentoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Documento</label>
                                <input type="text" 
                                    id="numeroDocumentoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='numerodocumento'
                                    value={formData.numerodocumento}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="nombresclienteTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nombres y Apellidos del Cliente</label>
                                <input type="text" 
                                    id="nombresclienteTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='nombrescliente'
                                    value={formData.nombrescliente}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tiposervicioTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">PRODUCTO</label>
                                <input type="text" 
                                    id="tiposervicioTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='tiposervicio'
                                    value={formData.tiposervicio}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="capitalTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Monto Capital</label>
                                <input type="text" 
                                    id="capitalTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='capital'
                                    value={formData.capital}
                                    readOnly
                                />
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="interes_socioTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Interés Socio</label>
                                <input type="text" 
                                    id="interes_socioTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='interes_socio'
                                    value={formData.interes_socio}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="interes_negocioTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Interés Negocio</label>
                                <input type="text" 
                                    id="interes_negocioTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='interes_negocio'
                                    value={formData.interes_negocio}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="interesTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Total Interes</label>
                                <input type="number" 
                                    id="interesTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='interes'
                                    value={formData.interes}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="totalTxt" className="block mb-2 text-lg font-medium text-red-600 dark:text-white">Total a Pagar</label>
                                <input type="number" 
                                    id="totalTxt" 
                                    className="bg-gray-50 border border-gray-300 font-semibold text-red-600 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='total'
                                    value={formData.total}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="fechavencimientoanteriorTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Fecha Vencimiento:</label>
                                <input type="text" 
                                    id="fechavencimientoanteriorTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='fechavencimientoanterior'
                                    value={formData.fechavencimientoanterior}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="fechaTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Fecha de Pago</label>
                                <Datepicker id="fechaTxt"
                                    inputClassName="w-full px-3 py-2 dark:bg-gray-900 rounded-sm text-lg border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
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
                                <label htmlFor="nro_diasTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Días Trasnc.</label>
                                <input type="text" 
                                    id="nro_diasTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='nro_dias'
                                    value={formData.nro_dias}
                                    readOnly
                                />
                            </div>
                            
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="montoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Monto Recibido</label>
                                <input type="number" 
                                    id="montoTxt" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='monto'
                                    value={formData.monto || ''}
                                    onChange={handleChange}
                                    onBlur={handleCalcularMontoRestante}
                                    required
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="montorestanteTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Monto Restante</label>
                                <input type="text" 
                                    id="montorestanteTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='montorestante'
                                    value={formData.montorestante || ''}
                                    readOnly
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
                
                    <div className="bg-white p-4 rounded-md mt-4">
                        <div className="grid grid-cols-2">
                            <h2 className="text-gray-500 text-lg font-semibold pb-4">Busqueda de Cliente con Credito Activo</h2>
                        </div>
                        <div className="my-1"></div> 
                        <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                        
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
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">N° CREDITO</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DNI</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Nombre cliente</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha CREDITO</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha VCTO</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">PRODUCTO</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light ">TOTAL A PAGAR</th>
                                    <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cobros?.map((cobro) => (
                                        <tr className="hover:bg-grey-lighter" key={cobro.id}>
                                            <td className="py-2 px-4 border-b border-grey-light">{cobro.codigocredito}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{cobro.numerodocumento}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{cobro.nombrescliente}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{formatoFecha(cobro.fecha)}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{formatoFecha(cobro.fechalimite)}</td>
                                            <td className="py-2 px-4 border-b border-grey-light">{cobro.tiposervicio}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-right">S/. {(cobro.monto + cobro.interes_socio + cobro.interes_negocio).toFixed(2)}</td>
                                            <td className="py-2 px-4 border-b border-grey-light text-center">
                                                {
                                                    estadoApertura === 0 ? (
                                                        <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(cobro)}><i className="fas fa-money-bill-alt"></i></Link>
                                                    ) : ""
                                                }
                                                
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

export default Cobros;