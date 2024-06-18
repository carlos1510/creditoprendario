import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import Pagination from '../../components/Pagination/Pagination';
import { getCobros } from '../../services/cobros';
import { useTitle } from '../../components/Title/Title';
import { getUsuariosByEmpresa } from '../../services/usuarios';
import { formatoFecha } from '../../utils/util';
import { authProvider } from '../../auth';

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