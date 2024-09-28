import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import Pagination from '../../components/Pagination/Pagination';
import { getCobros, getImprimirTicketPago } from '../../services/cobros';
import { useTitle } from '../../components/Title/Title';
import { getUsuariosByEmpresa } from '../../services/usuarios';
import { formatoFecha } from '../../utils/util';
import { authProvider } from '../../auth';
import ticket from '../../utils/ticket';

function Pagos(){
    useTitle('Pagos Diario');
    const [cobros, setCobros] = React.useState([]);
    const totalPage = cobros.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [responsableId, setResponsableId] = React.useState("");
    const [nroDocumentoFiltro, setNroDocumentoFiltro] = React.useState("");
    const [users, setUsers] = React.useState([]);

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
        fechaActual();
        getResponsables();
        
        getLista();
    }, []);

    const fechaActual = () => {
        let date = new Date();

        let fechaActual = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        setFechaIni({startDate: fechaActual, endDate: fechaActual});
        setFechafin({startDate: fechaActual, endDate: fechaActual});
        
    }

    async function getResponsables(){
        const [resultados] = await Promise.all([getUsuariosByEmpresa()]);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }

        setUsers(resultados);
    }

    async function getLista(){
        const [resultados] = await Promise.all([getCobros(responsableId, fechaIni.startDate, fechafin.startDate, nroDocumentoFiltro)]);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }
        
        setCobros(resultados);
    }

    async function obtenerDuplicadoTicket(id){
        const [resultados] = await Promise.all([getImprimirTicketPago(id)]);

        console.log(resultados);

        if(resultados === 401){
            authProvider.logoutStorage();
            navigate("/login");
        }
        
        onGenerateTicket('print', resultados);

        onGenerateTicketSocio('print', resultados);
    }

    //INICIO PARA TICKET
    const onGenerateTicket = async (output, data) => {

        const content = [
            { text: '' + data.nombre_empresa?data.nombre_empresa:'', style: 'headerMax', margin: [0, 10, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },
            { text: '' + data.razonsocial, style: 'text' },
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
            { text: '' + data.nombrenegocio?data.nombrenegocio:'', style: 'headerMax', margin: [0, 10, 0, 0] },
            { text: '----------------------------------------------------------------------------------------', style: 'text' },
            { text: '' + data.razonsocialsocio, style: 'text' },
            { text: 'RUC: ' + data.rucsocio, style: 'text' },
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
            <div className='grid grid-cols-1'>
                <div className="bg-white p-4 rounded-md mt-4">
                    <div className="grid grid-cols-2">
                        <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Pagos Diarios</h2>
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
                                {
                                    users?.map((user) => (
                                        <option key={user.id} value={user.id}>{user.nombres} {user.apellidos}</option>
                                    ))
                                }
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
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">N° de Credito</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DNI</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Nombre cliente</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Producto</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha Vcto</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Fecha Pago</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Monto</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cobros?.map((cobro) => (
                                    <tr className="hover:bg-grey-lighter" key={cobro.id}>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{ cobro.codigocredito }</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{ cobro.nrodoc_cliente }</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{ cobro.nombrescliente }</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{ cobro.tiposervicio }</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{ formatoFecha(cobro.fechavencimientoanterior) }</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">{ formatoFecha(cobro.fecha) }</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-right">
                                            <span className="text-lg">S/. { cobro.monto }</span>
                                        </td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            <button type='button' className="bg-yellow-300 hover:bg-yellow-400 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> obtenerDuplicadoTicket(cobro.id)}><i className="fas fa-print"></i></button>
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
        </>
    );
}

export default Pagos;