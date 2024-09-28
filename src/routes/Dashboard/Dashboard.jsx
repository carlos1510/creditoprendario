import * as React from 'react';

import CardIcon from "../../components/CardIcon/CardIcon";
import Persons from "../../svg/Persons";
import Money from "../../svg/Money";
import Datepicker from "react-tailwindcss-datepicker";
import { useTitle } from "../../components/Title/Title";
import { getDashboard } from '../../services/dashboard';


function Dashboard() {
    useTitle('Dashboard');

    const [datos, setDatos] = React.useState({});

    const [fechaIni, setFechaIni] = React.useState({
        startDate: null,
        endDate: null
    });

    const [fechafin, setFechafin] = React.useState({
        startDate: null,
        endDate: null
    });

    React.useEffect(() => {
        fechaActual();
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

    const handleFechaIniChange = (newValue) => {
        setFechaIni(newValue); 
    } 

    const handleFechaFinChange = (newValue) => {
        setFechafin(newValue); 
    } 

    const handleClicDashboar = async () => {
        const [resultados] = await Promise.all([getDashboard(fechaIni.startDate, fechafin.startDate)]);
        setDatos(resultados);
    }

    return (
        <>
            <div className="bg-white p-4 rounded-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="mb-4">
                        <label >DE: <span className='text-red-600'>*</span></label>
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
                        <label >HASTA: <span className='text-red-600'>*</span></label>
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

                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-300 to-indigo-300 border border-fuchsia-100 hover:border-violet-100 hover:to-indigo-400 text-white font-semibold mt-5 py-3 px-4 rounded" 
                            onClick={handleClicDashboar}
                        >
                            <i className="fas fa-search"></i> Buscar
                        </button>
                    </div>
                </div>
                <div className="my-1"></div> 
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                {/* Cards */}
                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

                    <CardIcon clase="bg-amber-200" color="orange" typeIcon={Persons} text="Total clientes Activos" amount={datos.total_cliente?.cantidad!==undefined?datos.total_cliente?.cantidad:0} />
                    

                    <CardIcon clase="bg-sky-300" color="blue" typeIcon={Money} text="Saldo Capital" amount={`S/. ${datos.total_capital?.montocapital!==undefined?datos.total_capital?.montocapital:0}`} />

                    <CardIcon clase="bg-green-400" color="teal" typeIcon={Money} text="Total a Cobrar" amount={`S/. ${datos.total_restante?.total!==undefined?datos.total_restante?.total:0}`} />

                    <CardIcon clase="bg-blue-400" color="blue" typeIcon={Money} text="Total Cobrado" amount={`S/. ${datos.total_cobrado?.montocobrado!==undefined?datos.total_cobrado.montocobrado:0}`} />

                    {/* <CardIcon clase="bg-red-400" color="red" typeIcon={Money} text="Saldo Capital Negocio" amount={"$ 6000"} />

                    <CardIcon clase="bg-red-400" color="red" typeIcon={Money} text="Total Cobro - Negocio" amount={"$ 6000"} />

                    <CardIcon clase="bg-green-300" color="green" typeIcon={Money} text="Saldo Capital Socio" amount={"$ 6000"} />

                    <CardIcon clase="bg-green-300" color="green" typeIcon={Money} text="Total Cobro - Socio" amount={"$ 6000"} />
                    <CardIcon clase="bg-green-200" color="green" typeIcon={Money} text="Monto Prestado" amount={"$ 6000"} /> */}

                    
                
                </div>
            </div>
            
        </>
    );
}

export default Dashboard;