import * as React from 'react';
import { Form, Link } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker"; 
import Swal from "sweetalert2";
import Pagination from '../../components/Pagination/Pagination';
import { createdUser, editUser, getUsuarioByNroDoc, getUsuarios } from '../../services/usuarios';
import { useTitle } from '../../components/Title/Title';

const initialValues = {
    id: 0,
    tipodocumentoid: "",
    numerodocumento: "",
    nombres: "",
    apellidos: "",
    username: "",
    email: "",
    password: "",
    acceso: 0,
    rol: "",
    empresa_id: 1
};

function Usuario(){
    useTitle('Usuarios');
    const [usuarios, setUsuarios] = React.useState([]);
    const [formData, setFormData] = React.useState(initialValues);
    const [isChecked, setIsChecked] = React.useState(false);
    const [register, setRegister] = React.useState(false);
    const totalPage = usuarios.length;
    const [perPage, setPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [estadoRegistro, setEstadoRegistro] = React.useState(false); // para un nuevo registro y para editar
    
    const lastIndex = currentPage * perPage;
    const firstIndex = lastIndex - perPage;

    React.useEffect(() => {
        setFormData(initialValues);
        getLista();
    }, []);

    async function getLista(){
        const [resultados] = await Promise.all([getUsuarios()]);
        
        setUsuarios(resultados);
    }

    async function obtenerDatosUserByNumDoc() {
        const [resultados] = await Promise.all([getUsuarioByNroDoc(formData.tipodocumentoid, formData.numerodocumento)]);
        if(resultados.nombres === ''){
            Swal.fire({
                icon: "warning",
                title: "Advertencia!", 
                text: "Usuario no Encontrado, por favor ingrese manualmente el nombre", 
                timer: 5000
            });
        }else{
            setFormData({...formData, id: resultados.id?resultados.id:"", nombres: resultados.nombres, apellidos: resultados.apellidos});
        }
    }

    async function confirmCreatedUser(){
        try{
            const response = await createdUser(formData);
            
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

    async function confirmUpdateUser(){
        try{
            const response = await editUser(formData.id, formData);
            
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

    const handleSubmit = (event) => {
        event.preventDefault();
        if(estadoRegistro){
            //editamos
            confirmUpdateUser();
        }else{
            //guardamos
            confirmCreatedUser();
        }  
    }

    const handleNewEdit = (estado, datos) => {
        setEstadoRegistro(estado);
        setRegister(!register);
        if(datos){
            setFormData({
                id: datos.id,
                tipodocumentoid: datos.tipodocumentoid,
                numerodocumento: datos.numerodocumento,
                nombres: datos.nombres,
                apellidos: datos.apellidos,
                username: datos.username,
                email: datos.email,
                acceso: datos.acceso,
                rol: datos.rol,
                empresa_id: datos.empresa_id
            });
            if(datos.acceso === 1){
                setIsChecked(true);
            }else{
                setIsChecked(false);
            }
        }else{
            setFormData(initialValues);
        }
        
    }

    function handleChange(event){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        
    }

    const checkHandler = () => {
        setIsChecked(!isChecked)
        if(isChecked){
            setFormData({ ...formData, acceso: 0 });
        }else{
            setFormData({ ...formData, acceso: 1 });
        }
    }

    const onChangePage = (value) => {
        setPerPage(value);
        setCurrentPage(1);
    }

    return (
        <>           
            {register ? (
                <div className="  bg-white p-4 rounded-md mt-4 shadow border border-gray-300  border-solid">
                    <h2 className="text-gray-500 text-center text-lg font-semibold pb-4">{estadoRegistro?'EDITAR': 'REGISTRAR'} USUARIO</h2>
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
                                <label htmlFor="tipodocumentoidCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de Documento <span className='text-red-600'>*</span></label> 
                                <select id="tipodocumentoidCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='tipodocumentoid'  
                                    value={formData.tipodocumentoid}
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">---</option>
                                    <option value="1">DNI</option>
                                    <option value="2">Pasaporte/Carnet Extranjeria</option>
                                </select>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="numerodocumentoTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nro. Documento <span className='text-red-600'>*</span></label> 
                                <input type="text" 
                                    id="numerodocumentoTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    value={formData.numerodocumento}
                                    onChange={handleChange} 
                                    name='numerodocumento'
                                    required
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <button type="button" 
                                    className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto md:mt-7 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={obtenerDatosUserByNumDoc}
                                >
                                    <i className='fas fa-search'></i> Buscar
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="apellidosTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellidos <span className='text-red-600'>*</span></label> 
                                <input type="text" 
                                    id="apellidosTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='apellidos'
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="nombresTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres <span className='text-red-600'>*</span></label> 
                                <input type="text" 
                                    id="nombresTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='nombres'
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <label htmlFor="emailTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo Electronico <span className='text-red-600'>*</span></label> 
                            <input type="email" 
                                id="emailTxt" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="relative z-0 w-full mb-5 group">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Acceso</label> 
                                <input type="checkbox" 
                                    id='accesoCbx' 
                                    className="appearance-none w-9 focus:outline-none checked:bg-blue-300 h-5 bg-gray-300 rounded-full before:inline-block before:rounded-full before:bg-blue-500 before:h-4 before:w-4 checked:before:translate-x-full shadow-inner transition-all duration-300 before:ml-0.5" 
                                    name='acceso'
                                    checked={isChecked}
                                    onChange={checkHandler}
                                />
                                <label className="ml-2 font-normal cursor-pointer select-none text-sm text-slate-700" htmlFor="accesoCbx">NO</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="rolCmb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rol <span className='text-red-600'>*</span></label> 
                                <select id="rolCmb" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name='rol'
                                    value={formData.rol}
                                    onChange={handleChange}
                                >
                                    <option value="---">---</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="SubAdministrador">SubAdministrador</option>
                                    <option value="Cajero">Cajero(a)</option>
                                    <option value="Prestamista">Prestamista</option>
                                </select>
                            </div>
                        </div>
         
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="usernameTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario <span className='text-red-600'>*</span></label> 
                                <input type="text" 
                                    id="usernameTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <label htmlFor="passwordTxt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                                <input type="password" 
                                    id="passwordTxt" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
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
                        <h2 className="text-gray-500 text-lg font-semibold pb-4">Lista de Usuarios</h2>
                        
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
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">Tipo Doc.</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NRO. DOC.</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">NOMBRES</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">USUARIO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">ACCESO</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light">ROL</th>
                                <th className="py-2 px-4 bg-grey-lightest font-bold uppercase text-sm text-grey-light border-b border-grey-light text-center">Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                usuarios?.map((usuario) => (
                                    <tr className="hover:bg-grey-lighter" key={usuario.id}>
                                        <td className="py-2 px-4 border-b border-grey-light">{usuario.tipodocumentoid===1?'DNI':'Pasaporte/Carnet Extranjeria'}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{usuario.numerodocumento}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{usuario.nombres} {usuario.apellidos}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{usuario.username}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{usuario.acceso===1?'SI':'NO'}</td>
                                        <td className="py-2 px-4 border-b border-grey-light">{usuario.rol}</td>
                                        <td className="py-2 px-4 border-b border-grey-light text-center">
                                            <Link className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 mr-1 rounded" onClick={()=> handleNewEdit(true, usuario)}><i className="fas fa-edit"></i></Link>
                                        </td>
                                        
                                    </tr> 
                                )).slice(firstIndex, lastIndex)
                            }
                            
                        </tbody>
                    </table>

                    <Pagination 
                        perPage={perPage} 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        totalPage={totalPage} 
                    />
                    
                </div>
                </div>
            )}
        </>
    );
}

export default Usuario;