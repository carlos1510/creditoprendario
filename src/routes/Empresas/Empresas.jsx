import * as React from 'react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from '../../components/Pagination/Pagination';
import { createdEmpresa, deleteEmpresa, editEmpresa, getEmpresas } from '../../services/empresas';
import { useTitle } from '../../components/Title/Title';

const initialValues = {
    id: 0,
    tipodocumentoid: "",
    numerodocumento: "",
    nombre: "",
    email: "",
    direccion: "",
    rutaimagen: "",
    gps: 0,
    tipomoneda: "PEN",
    simbolomoneda: "S/."
};

function Empresas(){
    useTitle('Pago Alquiler');
    const [empresas, setEmpresas] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const totalPage = empresas.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [register, setRegister] = React.useState(false);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar
    
    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage;

    React.useEffect(() => {
        setFormData(initialValues);
        getLista();
    }, []);

    async function confirmCreatedEmpresa(){
        try{
            const response = await createdEmpresa(formData);
            
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

    async function confirmUpdateEmpresa(){
        try{
            const response = await editEmpresa(formData.id, formData);
            
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

    async function confirmDeleteEmpresa(id){
        try{
            const response = await deleteEmpresa(id);
        
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
        const [resultados] = await Promise.all([getEmpresas()]);
        
        setEmpresas(resultados);
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdateEmpresa();
        }else{
            //guardamos
            confirmCreatedEmpresa();

        }  
    }

    const handleNewEdit = (estado, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        if(datos){
            setFormData({
                id: datos.id,
                tipodocumentoid: datos.tipodocumentoid,
                nombre: datos.nombre?datos.nombre:'',
                numerodocumento: datos.numerodocumento,
                email: datos.email?datos.email:'',
                direccion: datos.direccion?datos.direccion:'',
                telefono: datos.telefono?datos.telefono:''
            });
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
                confirmDeleteEmpresa(id);
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
                <h2 className="text-gray-500 text-lg font-semibold pb-4">{estadoRegistro?'EDITAR': 'REGISTRAR'} EMPRESA</h2>
                <div className="my-1"></div> 
                <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div> 
                <form className="max-w-screen-lg mx-auto" onSubmit={handleSubmit} >
                    {
                        estadoRegistro && (
                            <input type="hidden" name="id" value={formData.id} />
                        )
                    }
                    <div className="grid md:grid-cols-3 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="tipodocumentoidCmb" 
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Documento <span className='text-red-600'>*</span></label> 
                            <select id="tipodocumentoidCmb" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid"
                                name='tipodocumentoid'  
                                value={formData.tipodocumentoid}
                                onChange={handleChange} 
                                required
                            >
                                <option value="">---</option>
                                <option value="1">DNI</option>
                                <option value="3">RUC</option>
                            </select>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="numerodocumentoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nro. Documento <span className='text-red-600'>*</span></label> 
                            <input type="text" 
                                id="numerodocumentoTxt" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid" 
                                value={formData.numerodocumento}
                                onChange={handleChange} 
                                name='numerodocumento'
                                required
                            />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <button type="button" className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto md:mt-7 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <i className='fas fa-search'></i> Buscar
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="nombreTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razón Social <span className='text-red-600'>*</span></label> 
                            <input type="text" 
                                id="nombreTxt" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid" 
                                value={formData.nombre}
                                onChange={handleChange} 
                                name='nombre'
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="direccionTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dirección </label> 
                            <input type="text" 
                                id="direccionTxt" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid" 
                                value={formData.direccion}
                                onChange={handleChange} 
                                name='direccion'
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="telefonoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefono </label> 
                            <input type="number" 
                                id="telefonoTxt" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid" 
                                value={formData.telefono}
                                onChange={handleChange} 
                                name='telefono'
                            />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="emailTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label> 
                            <input type="email" 
                                id="emailTxt" 
                                className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300  border-solid" 
                                value={formData.email}
                                onChange={handleChange} 
                                name='email'
                            />
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
                    <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Empresas</h2>
                    
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
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TIPO DE DOC</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. DOCUMENTO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">RAZON SOCIAL</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">TELEFONO</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">EMAIL</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">DIRECCION</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Editar</th>
                            <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            empresas?.map((empresa) => 
                                (<tr className="hover:bg-grey-lighter" key={empresa.id}>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{empresa.tipodocumentoid}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{empresa.numerodocumento}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{empresa.nombre}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{empresa.telefono}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{empresa.email}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">{empresa.direccion}</td>
                                    <td className="py-2 px-4 border-b border-grey-light text-center">
                                    <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(true, empresa)}><i className="fas fa-edit"></i></Link>
                                    </td>
                                    
                                    <td className="py-2 px-4 border-b border-grey-light text-center">
                                        <Link className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded" onClick={() => handleDelete(empresa.id)}><i className="fas fa-trash-alt"></i></Link>
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

export default Empresas;