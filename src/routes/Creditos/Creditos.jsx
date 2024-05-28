import * as React from 'react';
import { Await, Form, Link } from "react-router-dom";
import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
  } from "tw-elements-react";
import Datepicker from "react-tailwindcss-datepicker"; 
import Pagination from '../../components/Pagination/Pagination';
import { formatoFecha } from '../../utils/util';
import Swal from "sweetalert2";
import { createdCredito, deleteCredito, editCredito, getCreditos, getImprimirTicketCredito, getNroComprobante, getNumeroContratoCredito } from '../../services/creditos';
import { numeroALetras } from '../../utils/numeroALetras';
import { getClienteByNroDoc } from '../../services/clientes';
import { getServicios } from '../../services/servicios';
import { useTitle } from '../../components/Title/Title';
import { obtenerAperturaCaja } from '../../services/caja';
import ticket from '../../utils/ticket';
import documento from '../../utils/documentPdf';
import { getDetalleCreditoByIdCredito } from '../../services/detalleCredito';

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
    interes: 0,
    subtotal: "",
    total: 0,
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
    cliente_id: null,
    numerocredito: "",
    codigocredito: "",
    numerocontrato: "",
    codigocontrato: "",
    detalle: []
};

const camposTipoServicio = [
    { item: 1, servicio_id: 1, label1: "KILATAJE", label2: "PESO BRUTO (gramo)", label3: "PESO NETO (gramo)" },
    { item: 2, servicio_id: 2, label1: "MARCA", label2: "MODELO", label3: "PLACA" },
    { item: 3, servicio_id: 3, label1: "MARCA", label2: "MODELO", label3: "SERIE" },
];

const initialValuesDetalle = {
    id: 0,
    servicio_id: 0,
    credito_id: 0,
    descripcion: "",
    valor1: "",
    valor2: "",
    valor3: "",
    observaciones: "",
    valorizacion: ""
}

function Creditos(){
    useTitle('Creditos');
    const [showModal, setShowModal] = React.useState(false);
    const [showTipoServicio, setShowTipoServicio] = React.useState("");
    const [titulosServicio, setTitulosServicio] = React.useState({});
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
    const [estadoApertura, setEstadoApertura] = React.useState(-1);
    const [detalleProducto, setDetalleProducto] = React.useState([]);
    const [formDataDetalle, setFormDataDetalle] = React.useState(initialValuesDetalle);
    const [montoTotal, setMontoTotal] = React.useState(0);

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
        verificarAperturaExistente();
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
            setFormData({...formData, cliente_id: resultados.id?resultados.id:null, nombrescliente: resultados.nombrescliente, 
                direccion: resultados.direccion?resultados.direccion:"", 
                telefono1: resultados.telefono1?resultados.telefono1:"", 
                telefono2: resultados.telefono2?resultados.telefono2:"",
                referencia: resultados.referencia?resultados.referencia:"",
                email: resultados.email?resultados.email:""});

        }
    }

    const searchTitleService = (event) => {
        setShowTipoServicio(event.target.value);
        let idServicio = event.target.value;
        if(idServicio !== ""){
            const [servicio] = camposTipoServicio.filter(a =>
                parseInt(a.servicio_id) === parseInt(idServicio)
            )
            setTitulosServicio(servicio);
        }else{
            setTitulosServicio({});
        }
    }

    async function obtenerDuplicadoTicket(id){
        const [resultados] = await Promise.all([getImprimirTicketCredito(id)]);
        
        onGenerateTicket('print', resultados);
        onGenerateDocumento('print', resultados);
    }

    //INICIO PARA TICKET
    const [base64, setBase64] = React.useState('');
    const [message, setMessage] = React.useState('');

    const onGenerateTicket = async (output, data) => {
        console.log(data.pago);
        setBase64('');
        setMessage('');

        const content = [
            { text: '' + data.pago.nombrenegocio?data.pago.nombrenegocio:'', style: 'header', margin: [0, 10, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },
            { text: '' + data.pago.nombre_empresa, style: 'text' },
            { text: '' + data.pago.direccion_empresa, style: 'text' },
            { text: '' + data.pago.descripcion_tipo_doc_empresa + ': ' + data.pago.nrodoc_empresa, style: 'text' },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },

            //TIPO Y NUMERO DOCUMENTO
            { text: '' + data.pago.nom_tipo_comprobante, style: 'header', margin: [0, 5, 0, 2.25] },
            { text: '' + data.pago.codigogenerado, style: 'header', margin: [0, 2.25, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },

            //DATOS CEBECERA FACTURAR
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['25%', '35%', '15%', '25%'],
                    body: [
                        [
                        { text: 'FECHA:', style: 'tHeaderLabel' },
                        { text: '' + formatoFecha(data.pago.fecha), style: 'tHeaderValue' },
                        { text: 'HORA:', style: 'tHeaderLabel' },
                        { text: '' + data.pago.hora, style: 'tHeaderValue' },
                        ],
                        [
                        { text: 'CLIENTE:', style: 'tHeaderLabel' },
                        { text: '' + data.pago.nombrescliente, style: 'tHeaderValue', colSpan: 3 },
                        {},
                        {},
                        ],
                        [
                        { text: 'DNI:', style: 'tHeaderLabel' },
                        { text: '' + data.pago.nrodoc_cliente, style: 'tHeaderValue', colSpan: 3 },
                        {},
                        {},
                        ],
                        [
                        { text: 'CAJERO:', style: 'tHeaderLabel' },
                        { text: '' + data.pago.nombres_cajero, style: 'tHeaderValue', colSpan: 3 },
                        {},
                        {},
                        ],
                        [
                            { text: 'FECHA LIMITE:', style: 'tTotals', alignment: 'left', colSpan: 2, margin: [10, 6, 0, 0] },
                            {},
                            { text: '' + formatoFecha(data.pago.fechalimite), style: 'tHeaderValue', alignment: 'left', colSpan: 2, margin: [0, 6, 0, 0] },
                            {},
                        ],
                        [
                            {text: 'PLAZO:', style: 'tHeaderValue', alignment: 'left', colSpan: 2, margin: [10, 0, 0, 0]},
                            {},
                            {text: '' + data.pago.plazo, style: 'tHeaderValue', alignment: 'left', colSpan: 2, margin: [0, 0, 0, 0]}
                        ],
                        [
                            {text: 'N° CREDITO:', style: 'tHeaderValue', alignment: 'left', colSpan: 2, margin: [10, 0, 0, 0]},
                            {},
                            {text: '' + data.pago.codigocredito, style: 'tHeaderValue', alignment: 'left', colSpan: 2, margin: [0, 0, 0, 0]}
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
                                { text: '' + data.pago.tiposervicio, style: 'tProductsBody', colSpan: 4, margin: [5, 0, 0, 0] },
                                {},
                                {},
                                {},
                            ],
                            
                        ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 10, 0, 0],
                table: {
                  widths: ['25%', '35%', '15%', '25%'],
                  body: [
                    //TOTALES
                    [
                      { text: 'PRESTAMO', style: 'tTotals', alignment: 'left',colSpan: 2, margin: [5, 0, 0, 0], },
                      {},
                      {text: 'S/:', alignment: 'left', style: 'tTotals'},
                      { text: '' + (data.pago.monto).toFixed(2), alignment: 'left',style: 'tTotals' },
                      
                    ],
                    //TOTAL IMPORTE EN LETRAS
                    [
                      {
                        text: 'SON: ' + numeroALetras((data.pago.monto).toFixed(2), 'SOLES'),
                        style: 'tProductsBody',
                        colSpan: 4,
                        margin: [10, 4, 0, 0],
                      },
                      {},
                      {},
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

        if (output === 'b64') {
        setBase64(response?.content ?? '');
        }

        setMessage(response?.message);

        setTimeout(() => {
        setMessage('');
        }, 2000);
    };
    // fin para ticket

    const onGenerateDocumento = async (output, data) => {

        const [servicio] = camposTipoServicio.filter(a =>
            parseInt(a.servicio_id) === parseInt(data.pago.servicio_id)
        )
        const detalle = new Array();
        const detalle2 = new Array();
        let j = 0;
        for(let i = 0; i < data.detalles.length; i++){
            if(i === 0){
                
                detalle[j] = [
                    { text: 'ITEM', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: 'DESCRIPCION', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: '' + servicio.label1, style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: '' + servicio.label2, style: 'tHeaderLabelCenter' },
                    { text: '' + servicio.label3, style: 'tHeaderLabelCenter' },
                    { text: 'OBSERVACIONES', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: 'VALORIZACION', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                ];
                detalle2[j] = [
                    { text: 'ITEM', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: 'DESCRIPCION', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: '' + servicio.label1, style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: '' + servicio.label2, style: 'tHeaderLabelCenter' },
                    { text: '' + servicio.label3, style: 'tHeaderLabelCenter' },
                    { text: 'OBSERVACIONES', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                    { text: 'VALORIZACION', style: 'tHeaderLabelCenter', margin: [0,5,0,0] },
                ];
            }
            detalle[j+1]= [
                {text: '' + (i + 1), style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].descripcion, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valor1, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valor2, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valor3, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].observaciones, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valorizacion, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] }
            ];
            detalle2[j+1]= [
                {text: '' + (i + 1), style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].descripcion, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valor1, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valor2, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valor3, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].observaciones, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] },
                {text: '' + data.detalles[i].valorizacion, style: 'tHeaderValueCenter', margin: [0, 5, 0, 0] }
            ];
            j++;
            
        }

        const content = [
            {text: 'ANEXO 1', style: 'header', headlineLevel: 1},
            {text: 'CONSTANCIA DE TASACIÓN, CARACTERISTICAS Y CONDICIONES DEL/LOS BIEN/ES DEPOSITADOS/S', style: 'header', margin: [55, 0, 55, 0], headlineLevel: 1},
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['12%', '5%', '46%', '12%', '5%', '20%'],
                    body: [
                        [
                        { text: 'Agencia', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: 'PUCALLPA', style: 'tHeaderValue' },
                        { text: 'Usuario', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: '' + data.pago.nombres_cajero, style: 'tHeaderValue' },
                        ],
                        [
                        { text: 'Cliente', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: '' + data.pago.nombrescliente, style: 'tHeaderValue' },
                        { text: 'Fecha/Hora', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: '' + data.pago.fechahoraactual, style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['12%', '5%', '46%', '12%', '5%', '20%'],
                    body: [
                        [
                            { text: 'D.O.I(DNI/CE)', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.nrodoc_cliente, style: 'tHeaderValue', colSpan: 4 },
                            {},
                            {},
                            {},
                        ],
                        [
                            { text: 'Dirección', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.direccioncliente, style: 'tHeaderValue', colSpan: 4 },
                            { },
                            { },
                            { },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['60%', '15%', '5%', '20%'],
                    body: [
                        [
                            { text: 'I) CONTRAPRESTACIÓN POR EL SERVICIO', style: 'tHeaderLabel' },
                            { text: 'N° de Contrato', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.codigocontrato, style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['15%', '5%', '20%', '60%'],
                    body: [
                        [
                            { text: 'Importe', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: 'S/. ' + (parseFloat(data.pago.interessocio)).toFixed(2), style: 'tHeaderValue' },
                            { text: '' + numeroALetras((data.pago.interessocio).toFixed(2)), style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 7, 0, 0],
                table: {
                    widths: ['15%', '5%', '20%', '60%'],
                    body: [
                        [
                            { text: 'Fecha de Inicio', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + formatoFecha(data.pago.fecha), style: 'tHeaderValue', colSpan: 2 },
                            {  },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 7, 0, 0],
                table: {
                    widths: ['15%', '5%', '20%', '60%'],
                    body: [
                        [
                            { text: 'Fecha de Pago', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + formatoFecha(data.pago.fechalimite), style: 'tHeaderValue', colSpan: 2 },
                            {  },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 7, 0, 0],
                table: {
                    widths: ['15%', '5%', '20%', '60%'],
                    body: [
                        [
                            { text: 'Forma de Pago', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.formapago, style: 'tHeaderValue' },
                            {  text: 'En efectivo o mediante los canales de pago que Socio Efectivo autorice', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {text: 'VALORIZACIÓN TOTAL DE/LOS BIENES:',  style: 'tHeaderLabel', margin: [0, 25, 0, 0]},
            {text: 'De común acuerdo entre las partes.',  style: 'tHeaderValue', margin: [0, 7, 0, 0]},
            {text: 'II) DESCRIPCIÓN DEL/LOS BIEN/ES OBJETO DE CUSTODIA',  style: 'tHeaderLabel', margin: [0, 15, 0, 0]},
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['5%', '15%', '10%', '15%', '15%', '25%', '15%'],
                    body: detalle.map((item) => {return item}),
                },
                
            },
            {text: 'III) PENALIDAD',  style: 'tHeaderLabel', margin: [0, 15, 0, 0]},
            {text: 'Se cobrará una penalidad de 10 soles, solo en caso de que, el cliente solicite la entrega de el/los bien/es el mismo dia de la celebración del contrato y se cumpla con lo previsto en el mismo.',  style: 'tHeaderValue', margin: [0, 5, 0, 0]},
            {text: 'IV) BENEFICIARIO DE LA GARANTIA MOBILIARIA',  style: 'tHeaderLabel', margin: [0, 15, 0, 0]},
            {text: 'EMPRESA DE CREDITOS SOCIO EFECTIVO, en virtud del CONTRATO DE PRÉSTAMO CONSUMO CON GARANTÍA MOBILIARIA N° ____________________________, de fecha ' + formatoFecha(data.pago.fecha) +'.',  style: 'tHeaderValue', margin: [0, 5, 0, 0]},
            {
                margin: [0, 50, 0, 0],
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: '_____________________', style: 'tHeaderLabelCenter' },
                            { text: '_____________________', style: 'tHeaderLabelCenter' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 4, 0, 0],
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'EL CLIENTE', style: 'tHeaderLabelCenter' },
                            { text: 'LA DEPOSITARIA', style: 'tHeaderLabelCenter' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 4, 0, 0],
                table: {
                    widths: ['10%', '10%', '45%','35%'],
                    body: [
                        [
                            { text: ' ', style: 'tHeaderValue' },
                            { text: 'Nombre:', style: 'tHeaderValue' },
                            { text: '' + data.pago.nombrescliente, style: 'tHeaderValue' },
                            { text: 'SOCIO EFECTIVO', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 2, 0, 0],
                table: {
                    widths: ['10%', '10%', '45%','35%'],
                    body: [
                        [
                            { text: ' ', style: 'tHeaderValue' },
                            { text: 'D.O.I:', style: 'tHeaderValue' },
                            { text: '' + data.pago.nrodoc_cliente, style: 'tHeaderValue' },
                            { text: '', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            '_______________________________________________',
            {
                margin: [0, 0, 0, 0],
                table: {
                    widths: ['1%', '99%'],
                    body: [
                        [
                            { text: '1', style: 'tTextXS' },
                            { text: 'En caso el Beneficiario de la Garantía Mobiliaria disponga la liberación '+
                                'anticipada del BIEN, el importe a cobrar será liquidado por los días efectivos de custodia.'
                                , style: 'text' 
                            },
                        ],
                        [
                            { text: '2', style: 'tTextXS' },
                            { text: 'Los canales de pago podrán ser en bancos o empresas del sistema financiero, así como '+
                                'el uso de medios electrónicos, autorizados por Socio Efectivo. Los costos asociados al uso '+
                                'de dichos medios de pago serán de cargo al CLIENTE.'
                                , style: 'text' 
                            },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 20, 0, 0],
                table: {
                    widths: ['15%', '30%', '30%','25%'],
                    body: [
                        [
                            { text: 'N° de Contrato', style: 'tHeaderValue' },
                            { text: '' + data.pago.codigocontrato, style: 'tHeaderValue' },
                            { text: 'Fecha/Hora:', style: 'tHeaderValue' },
                            { text: '' + data.pago.fechahoraactual, style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Agencia:', style: 'tHeaderValue' },
                            { text: 'PUCALLPA', style: 'tHeaderValue' },
                            { text: ' ', style: 'tHeaderValue' },
                            { text: ' ', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Usuario:', style: 'tHeaderValue' },
                            { text: '' + data.pago.nombres_cajero, style: 'tHeaderValue' },
                            { text: ' ', style: 'tHeaderValue' },
                            { text: ' ', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            //------------ ANEXO 2
            {text: '', pageBreak: 'after'},
            {text: 'HOJA RESUMEN - ANEXO 2', style: ['header','subrayado'], headlineLevel: 1},
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['12%', '5%', '46%', '12%', '5%', '20%'],
                    body: [
                        [
                        { text: 'Agencia', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: 'PUCALLPA', style: 'tHeaderValue' },
                        { text: 'Usuario', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: '' + data.pago.nombres_cajero, style: 'tHeaderValue' },
                        ],
                        [
                        { text: 'Cliente', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: '' + data.pago.nombrescliente, style: 'tHeaderValue' },
                        { text: 'Fecha/Hora', style: 'tHeaderLabel' },
                        { text: ':', style: 'tHeaderLabelCenter' },
                        { text: '' + data.pago.fechahoraactual, style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['12%', '5%', '46%', '12%', '5%', '20%'],
                    body: [
                        [
                            { text: 'D.O.I(DNI/CE)', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.nrodoc_cliente, style: 'tHeaderValue', colSpan: 4 },
                            {},
                            {},
                            {},
                        ],
                        [
                            { text: 'Dirección', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.direccioncliente, style: 'tHeaderValue', colSpan: 4 },
                            { },
                            { },
                            { },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 5,
                        x2: 535,
                        y2: 5,
                        lineWidth: 0.5
                    }
                ]
            },
            {
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 5,
                        x2: 535,
                        y2: 5,
                        lineWidth: 0.5
                    }
                ]
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['60%', '17.7%', '5%', '16.3%'],
                    body: [
                        [
                            { text: 'I) CONDICIONES GENERALES', style: 'tHeaderLabel' },
                            { text: 'N° de Credito', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.codigocredito, style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['19%', '5%', '23%', '30%','5%','18%'],
                    body: [
                        [
                            { text: 'Tipo de Producto', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + data.pago.tiposervicio, style: 'tHeaderValue' },
                            { text: 'Tasa de Costo Efectiva Anual', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '101.86%', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Moneda', style: 'tHeaderLabel' },
                            { text: ' ', style: 'tHeaderLabelCenter' },
                            { text: 'SOLES', style: 'tHeaderValue'},
                            { text: 'Tasa de Interés moratorio', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '0%', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Tasa de interés', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '7%', style: 'tHeaderValue'},
                            { text: 'nominal Anual (360 días). Aplica', style: 'tHeaderLabel' },
                            { text: ' ', style: 'tHeaderLabelCenter' },
                            { text: ' ', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Compensatorio Efectiva Menusal Fija', style: 'tHeaderLabel', colSpan: 2 },
                            { },
                            { text: ' ', style: 'tHeaderValue'},
                            { text: 'solo en caso de incumplimiento', style: 'tHeaderLabel' },
                            { text: ' ', style: 'tHeaderLabelCenter' },
                            { text: ' ', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Tasa de interés', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '101.86%', style: 'tHeaderValue'},
                            { text: 'Fecha del Desembolso', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '12/04/2024', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Compensatorio Efectiva Anual Fija (360 días)', style: 'tHeaderLabel', colSpan: 2 },
                            { },
                            { text: ' ', style: 'tHeaderValue'},
                            { text: 'Plazo', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '30 días', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 7, 0, 0],
                table: {
                    widths: ['18.7%', '5%', '76.3%'],
                    body: [
                        [
                            { text: 'Monto del préstamo', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: 'S/. ' + data.pago.monto, style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 7, 0, 0],
                table: {
                    widths: ['18.7%', '5%', '76.3%'],
                    body: [
                        [
                            { text: 'Fecha de Vencimiento', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '' + formatoFecha(data.pago.fechalimite), style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'ITF', style: 'tHeaderLabel' },
                            { text: ':', style: 'tHeaderLabelCenter' },
                            { text: '0.00%', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            {
                margin: [0, 7, 0, 0],
                table: {
                    widths: ['40%', '15%', '15%', '15%','15%'],
                    body: [
                        [
                            { text: '', style: 'tHeaderLabel' },
                            { text: 'Capital', style: 'tHeaderLabel' },
                            { text: 'Interés', style: 'tHeaderLabel'},
                            { text: 'ITF', style: 'tHeaderLabel' },
                            { text: 'Total', style: 'tHeaderLabel' },
                        ],
                        [
                            { text: 'Pago Mínimo', style: 'tHeaderLabel' },
                            { text: 'S/. ' + (data.pago.pagominimo).toFixed(2), style: ['tHeaderValue','textRight'] },
                            { text: 'S/. ' + (data.pago.interesnegocio).toFixed(2), style: ['tHeaderValue','textRight']},
                            { text: 'S/. 0.00', style: ['tHeaderValue','textRight'] },
                            { text: 'S/. ' + (parseFloat(data.pago.pagominimo) + parseFloat(data.pago.interesnegocio)).toFixed(2), style: ['tHeaderValue','textRight'] },
                        ],
                        [
                            { text: 'Pago Total', style: 'tHeaderLabel' },
                            { text: 'S/. ' + (data.pago.monto).toFixed(2), style: ['tHeaderValue','textRight'] },
                            { text: 'S/. ' + (data.pago.interesnegocio).toFixed(2), style: ['tHeaderValue','textRight']},
                            { text: 'S/. 0.00', style: ['tHeaderValue','textRight'] },
                            { text: 'S/. ' + (parseFloat(data.pago.monto) + parseFloat(data.pago.interesnegocio)).toFixed(2), style: ['tHeaderValue','textRight'] },
                        ],
                    ],
                },
            },
            
            {text: 'II) DATOS DEL DEPOSITARIO:',  style: 'tHeaderLabel', margin: [0, 15, 0, 0]},
            {
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            {
                                margin: [0, 4, 0, 0],
                                table: {
                                    widths: ['100%'],
                                    body: [
                                        [
                                            { text: 'Información del depositario del (los) bien(es) mueble(s) afecto(s) en garantia:', style: 'tHeaderValue' },
                                        ],
                                        [
                                            { text: 'Nombre o razón social', style: 'tHeaderValue' },
                                        ],
                                        [
                                            { text: 'DNI o RUC', style: 'tHeaderValue' },
                                        ],
                                        [
                                            { text: 'Domicilio', style: 'tHeaderValue' },
                                        ],
                                    ],
                                },
                                layout: 'noBorders',
                            },
                            {
                                margin: [0, 4, 0, 0],
                                table: {
                                    widths: ['100%'],
                                    body: [
                                        [ {  } ],
                                        [ {  } ],
                                        [ {  } ],
                                        [ {  } ],
                                    ],
                                },
                                layout: 'noBorders',
                            },
                        ],
                    ],
                },
                
            },
            {text: 'III) DETALLES DE LA GARANTIA MOBILIARIA:',  style: 'tHeaderLabel', margin: [0, 10, 0, 0]},
            {text: 'Empresa de Créditos Vica Oriente EIRL, ha recibido en garantia mobiliaria del préstamo indicado, el(los) bien(es) que a continuación se detalla(n):',  style: 'tHeaderValue', margin: [0, 5, 0, 0]},
            {
                margin: [0,5,0,0],
                table: {
                    
                    widths: ['5%', '15%', '10%', '15%', '15%', '25%', '15%'],
                    body: detalle2.map((item) => {return item}),
                },
                
            },
            {
                margin: [0, 80, 0, 0],
                table: {
                    widths: ['15%', '35%', '15%','35%'],
                    body: [
                        [
                            { text: 'N° de Crédito', style: 'tHeaderLabel' },
                            { text: '' + data.pago.codigocredito, style: 'tHeaderValue' },
                            { text: 'Fecha/Hora:', style: 'tHeaderLabel' },
                            { text: '' + data.pago.fechahoraactual, style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Agencia:', style: 'tHeaderLabel' },
                            { text: 'PUCALLPA', style: 'tHeaderValue' },
                            { text: 'Contrato: ', style: 'tHeaderLabel' },
                            { text: 'Resolución SBS N° 03518-2022', style: 'tHeaderValue' },
                        ],
                        [
                            { text: 'Usuario:', style: 'tHeaderLabel' },
                            { text: '' + data.pago.nombres_cajero, style: 'tHeaderValue' },
                            { text: ' ', style: 'tHeaderValue' },
                            { text: ' ', style: 'tHeaderValue' },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            
        ];

        const response = await documento(output, '_blank', content);
    }

    async function confirmCreatedCredito(){
        try{
            const response = await createdCredito(formData);

            onGenerateTicket('print', response);
            onGenerateDocumento('print', response);
            
            setRegister(!register);
            setFormData(initialValues);
            setFormDataDetalle(initialValuesDetalle);
            setDetalleProducto([]);
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

    function handlerCalcularFechaLimite(event, tipo) {
        let fechaObtenido = "";
        let idServicio = 0;

        if(tipo === 1){
            idServicio = formData.servicio_id;
            fechaObtenido = event.startDate;
        }else{
            if(tipo === 2){
                idServicio = event.target.value;
                fechaObtenido = fechaHoy.startDate;
            }
        }

        if( !isNaN(parseInt(idServicio))){
            const [servicio] = servicios.filter(a =>
                parseInt(a.id) === parseInt(idServicio)
            )
    
            calcularFechaLimite(fechaObtenido, servicio.periodo, servicio.numeroperiodo, servicio.id);
        }
        
    }

    function calcularFechaLimite(fechaObtenido,periodo, numero, servicio_id){
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

        setFormData({...formData, fecha: fechaObtenido, fechalimite: fechagenerado, servicio_id: servicio_id});
        
    }

    async function verificarAperturaExistente(){
        const [resultados] = await Promise.all([obtenerAperturaCaja()]);
        
        setEstadoApertura(resultados.apertura_activo);
    }

    async function obtenerNroComprobante(event){
        const [resultado] = await Promise.all([getNroComprobante(event.target.value)]);

        setFormData({...formData, seriecorrelativo: resultado.seriecorrelativo, numerocorrelativo: resultado.numerocorrelativo, codigogenerado: resultado.codigogenerado, tipo_comprobante_id: event.target.value});
    }

    async function obtenerNroContratoCredito(){
        const [resultado] = await Promise.all([getNumeroContratoCredito()]);

        setFormData({...formData, numerocredito: resultado.numerocredito, codigocredito: resultado.codigocredito, numerocontrato: resultado.numerocontrato, codigocontrato: resultado.codigocontrato});
    }

    async function obtenerDetalleCredito(datos){
        const [resultado] = await Promise.all([getDetalleCreditoByIdCredito(datos.id)]);

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
            numerocredito: datos.numerocredito,
            codigocredito: datos.codigocredito,
            numerocontrato: datos.numerocontrato,
            codigocontrato: datos.codigocontrato,
            cliente_id: datos.cliente_id?datos.cliente_id:null,
            detalle: resultado
        });

        setDetalleProducto(resultado);

        setFechaHoy({startDate: datos.fecha, endDate: datos.fecha});
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleChangeDetalle(event){
        const { name, value } = event.target;
        setFormDataDetalle({ ...formDataDetalle, [name]: value });
    }

    const handleSubmitProducto = (event) => {
        event.preventDefault();
        let item = detalleProducto.length + 1;
        
        setDetalleProducto([...detalleProducto, { item: item, descripcion: formDataDetalle.descripcion, valor1: formDataDetalle.valor1, valor2: formDataDetalle.valor2, valor3: formDataDetalle.valor3, observaciones: formDataDetalle.observaciones, valorizacion: formDataDetalle.valorizacion}]);
        
        setFormData({...formData, detalle: [...detalleProducto, { item: item, descripcion: formDataDetalle.descripcion, valor1: formDataDetalle.valor1, valor2: formDataDetalle.valor2, valor3: formDataDetalle.valor3, observaciones: formDataDetalle.observaciones, valorizacion: formDataDetalle.valorizacion}], monto: montoTotal, total_texto: numeroALetras(parseFloat(montoTotal), 'SOLES')});

        setFormDataDetalle(initialValuesDetalle);
        setShowModal(false);
        
    }

    const calcularMontoTotal = (event) => {
        let monto = parseFloat(formDataDetalle.valorizacion);
        setMontoTotal(parseFloat(montoTotal) + monto);
    }

    const handleDeleteProducto = (item) => {
        setDetalleProducto(detalleProducto.filter((value) => value.item !== item.item));

        let montocal = parseFloat(montoTotal) - parseFloat(item.valorizacion);
        setMontoTotal(montocal);
        setFormData({...formData, detalle: detalleProducto.filter((value) => value.item !== item.item), monto: montocal, total_texto: numeroALetras(montocal, 'SOLES')});
        console.log(formData);
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
            obtenerDetalleCredito(datos);
        }else{
            let date = new Date();
        
            let fechaActual = date.getFullYear() + "-" + ('0'+(date.getMonth() + 1)).toString().substr(-2) + "-" +('0'+date.getDate()).toString().substr(-2);
            setFechaHoy({startDate: fechaActual, endDate: fechaActual});
            setFormData(initialValues);
            
            setFormData({...formData, fecha: fechaActual});
            obtenerNroContratoCredito();
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

            <TEModal show={showModal} setShow={setShowModal}>
                <TEModalDialog size="lg">
                <TEModalContent>
                    <TEModalHeader>
                        <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                            Datos del Producto
                        </h5>
                        <button
                            type="button"
                            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                            </svg>
                        </button>
                    </TEModalHeader>
                    <TEModalBody>
                        <form className='mx-auto' >
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="descripcionModalTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">DESCRIPCION <span className='text-red-600'>*</span></label>
                                    <input type="text" 
                                        id="descripcionModalTxt" 
                                        className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        name='descripcion'
                                        value={formDataDetalle.descripcion}
                                        onChange={handleChangeDetalle}
                                        required
                                        
                                    />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="valor1Txt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">{titulosServicio.label1} <span className='text-red-600'>*</span></label>
                                    <input type="text" 
                                        id="valor1Txt" 
                                        className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        name='valor1'
                                        value={formDataDetalle.valor1}
                                        onChange={handleChangeDetalle}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="valor2Txt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">{titulosServicio.label2} <span className='text-red-600'>*</span></label>
                                    <input type="text" 
                                        id="valor2Txt" 
                                        className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        name='valor2'
                                        value={formDataDetalle.valor2}
                                        onChange={handleChangeDetalle}
                                        required
                                    />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="valor3Txt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">{titulosServicio.label3} <span className='text-red-600'>*</span></label>
                                    <input type="text" 
                                        id="valor3Txt" 
                                        className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        name='valor3'
                                        value={formDataDetalle.valor3}
                                        onChange={handleChangeDetalle}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="observacionesTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">OBSERVACIONES <span className='text-red-600'>*</span></label>
                                    <input type="text" 
                                        id="observacionesTxt" 
                                        className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        name='observaciones'
                                        value={formDataDetalle.observaciones}
                                        onChange={handleChangeDetalle}
                                        required
                                    />
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <label htmlFor="valorizacionTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">VALORIZACION <span className='text-red-600'>*</span></label>
                                    <input type="number" 
                                        id="valorizacionTxt" 
                                        className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        name='valorizacion'
                                        value={formDataDetalle.valorizacion}
                                        onChange={handleChangeDetalle}
                                        onBlur={(event) => calcularMontoTotal(event)}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </TEModalBody>
                    <TEModalFooter>
                        <TERipple rippleColor="light">
                            <button
                                type="button"
                                className="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring-0 active:bg-red-500"
                                onClick={() => setShowModal(false)}
                                >
                                Cancelar
                            </button>
                        </TERipple>
                        <TERipple rippleColor="light">
                            <button
                                type="button"
                                className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                    onClick={handleSubmitProducto}
                                >
                                Agregar
                            </button>
                        </TERipple>
                    </TEModalFooter>
                </TEModalContent>
                </TEModalDialog>
            </TEModal>
            
            {register ? (
                <div className="  bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">{estadoRegistro?'EDITAR': 'NUEVO'} CREDITO</h2>
                    <div className="my-1"></div> 
                    <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                    <form className=" mx-auto" onSubmit={handleSubmit}>
                        {
                            estadoRegistro && (
                                <input type="hidden" name="id" value={formData.id} />
                            )
                        }
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tipo_comprobante_idCmb" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Tipo de Comprobante <span className='text-red-600'>*</span></label>
                                <select id="tipo_comprobante_idCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                <label htmlFor="codigogeneradoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Comprobante <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="codigogeneradoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigogenerado'
                                    value={formData.codigogenerado}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="relative w-full mb-5 group">
                                <label htmlFor="fechaTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Fecha <span className='text-red-600'>*</span></label>
                                <Datepicker inputClassName="w-full px-3 py-2 dark:bg-gray-900 text-lg rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed"
                                    useRange={false} 
                                    asSingle={true} 
                                    value={fechaHoy} 
                                    name='fechaHoy'
                                    onChange={(event) => { handleFechaHoyChange(event); handlerCalcularFechaLimite(event, 1);}} 
                                    displayFormat={"DD/MM/YYYY"} 
                                    readOnly
                                    required
                                />
                                
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="codigocreditoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Credito <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="codigocreditoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigocredito'
                                    value={formData.codigocredito}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="codigocontratoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Contrato <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="codigocontratoTxt" 
                                    className="bg-gray-50 text-lg border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='codigocontrato'
                                    value={formData.codigocontrato}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                        <hr className='mb-4' />
                        <div className="grid md:grid-cols-3 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="countries" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Tipo de Documento <span className='text-red-600'>*</span></label>
                                <select id="countries" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                <label htmlFor="numerodocumentoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nro. Documento <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="numerodocumentoTxt" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='numerodocumento'
                                    value={formData.numerodocumento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <button type="button" 
                                    className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg sm:w-auto md:mt-9 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={obtenerClienteByNumDoc}
                                >
                                    <i className='fas fa-search'></i> Buscar
                                </button>
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="nombresclienteTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Nombres del Cliente <span className='text-red-600'>*</span></label>
                            <input type="text" 
                                id="nombresclienteTxt" 
                                className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='nombrescliente'
                                value={formData.nombrescliente}
                                onChange={handleChange}
                                required    
                            />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="direccionTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Dirección del Cliente</label>
                            <input type="text" 
                                id="direccionTxt" 
                                className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='direccion'
                                value={formData.direccion}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="referenciaTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Referencia</label>
                            <input type="text" 
                                id="referenciaTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='referencia'
                                value={formData.referencia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="telefono1Txt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Celular 1</label>
                                <input type="number" 
                                    id="telefono1Txt" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='telefono1'
                                    value={formData.telefono1}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="telefono2Txt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Celular 2</label>
                                <input type="number" 
                                    id="telefono2Txt" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='telefono2'
                                    value={formData.telefono2}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="emailTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Correo Electronico</label>
                            <input type="email" 
                                id="emailTxt" 
                                className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="grid md:grid-cols-1 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="servicio_idCmb" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Tipo de Producto/Servicio <span className='text-red-600'>*</span></label>
                                <select id="servicio_idCmb" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='servicio_id'
                                    value={formData.servicio_id}
                                    onChange={(event) => {handleChange(event); searchTitleService(event); handlerCalcularFechaLimite(event, 2);}}
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
                        </div>

                        <div className="flex flex-col">
                            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
                                            <thead className="border-b font-medium dark:border-neutral-500">
                                                <tr>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">ITEM</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">DESCRIPCION</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">{titulosServicio.label1}</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">{titulosServicio.label2}</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">{titulosServicio.label3}</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">OBSERVACIONES</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">VALORIZACION</th>
                                                    <th scope="col" className="border-r px-6 py-4 dark:border-neutral-500">
                                                        {
                                                            showTipoServicio!==""?(
                                                                <button type='button' className="bg-cyan-600 hover:bg-cyan-800 text-white font-semibold py-1.5 px-4 rounded" title='Nuevo Item' onClick={() => setShowModal(true)}><i className="fas fa-plus-circle"></i></button>
                                                            ):""
                                                        }
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    detalleProducto?.map((detalle, index) => (
                                                        <tr className="border-b dark:border-neutral-500" key={index}>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{index + 1}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{detalle.descripcion}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{detalle.valor1}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{detalle.valor2}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{detalle.valor3}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{detalle.observaciones}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">{detalle.valorizacion}</td>
                                                            <td className="whitespace-nowrap border-r px-6 py-2 font-medium dark:border-neutral-500">
                                                                <button type='button' className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDeleteProducto(detalle)}><i className="fas fa-trash-alt"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 md:gap-6 pt-3">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="tipomonedaCmb" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Tipo de Moneda <span className='text-red-600'>*</span></label>
                                <select id="tipomonedaCmb" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
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
                                <label htmlFor="montoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">PRESTAMO <span className='text-red-600'>*</span></label>
                                <input type="input" 
                                    id="montoTxt" 
                                    className=" border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='monto'
                                    value={formData.monto}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="fechalimiteTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Fecha Limite <span className='text-red-600'>*</span></label>
                                <input type="text" 
                                    id="fechalimiteTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='fechalimite'
                                    value={formData.fechalimite}
                                    onChange={handleChange}
                                    required 
                                    readOnly
                                />
                            </div>
                            
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="total_textoTxt" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Son: <span className='text-red-600'>*</span></label>
                            <input type="text" 
                                id="total_textoTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    {
                        estadoApertura===0?(
                            <div className="text-right ">
                                <button className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto text-white font-semibold py-2 px-4 rounded" onClick={()=> handleNewEdit(false, null)}>
                                    <i className="fas fa-plus-circle"></i> NUEVO CREDITO
                                </button>
                            </div>
                        ):("")
                    }
                    
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
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Nro. Credito</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. Contrato</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TIPO DE SERVICIO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">FECHA</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. DOC. CLIENTE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NOMBRES CLIENTE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">FECHA LIMITE</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TOTAL</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">iMPRIMIR</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">EDITAR</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">ELIMINAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                creditos?.map((credito) => (
                                    <tr className="hover:bg-grey-lighter" key={credito.id}>
                                        <td className="py-2 px-4 border-b border-grey-light">{credito.nombre_comprobante}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{credito.codigogenerado}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{credito.tiposervicio}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{formatoFecha(credito.fecha)}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{credito.numerodocumento}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{credito.nombrescliente}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{formatoFecha(credito.fechalimite)}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-right">S/. {credito.monto}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            <button type='button' className="bg-yellow-300 hover:bg-yellow-400 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> obtenerDuplicadoTicket(credito.id)}><i className="fas fa-print"></i></button>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            {
                                                estadoApertura===0?(
                                                    <button type='button' className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(true, credito)}><i className="fas fa-edit"></i></button>
                                                ):""
                                            }
                                            
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            {
                                                estadoApertura===0?(
                                                    <button type='button' className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDelete(credito.id)}><i className="fas fa-trash-alt"></i></button>
                                                ):""
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

export default Creditos;