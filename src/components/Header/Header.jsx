import * as React from 'react'
import { Form, Link } from 'react-router-dom';

function Header({onClick, username, rol}){
    const [hide, setHide] = React.useState(true);
    const [hideDrop, setHideDrop] = React.useState(false);
    const handleClick = () => {
        // Simular algún tipo de evento o cálculo
        setHide(!hide);
        // Llamar a la función de devolución de llamada proporcionada por el padre con el resultado
        onClick(hide);
      };

    return (
        <div className="bg-white text-white shadow w-full p-2 flex items-center justify-between">
            <div className="flex items-center">
                <div className="hidden md:flex items-center"> 
                    <img src="https://www.emprenderconactitud.com/img/POC%20WCS%20(1).png" alt="Logo" className="w-28 h-18 mr-2" />
                    <h2 className="font-bold text-xl">Nombre de la Aplicación</h2>
                </div>
                <div className="md:hidden flex items-center"> 
                    <button id="menuBtn" onClick={handleClick}>
                        <i className="fas fa-bars text-gray-500 text-lg"></i> 
                    </button>
                </div>
            </div>

            <div className="space-x-8">           
                <button className='flex items-center' onClick={()=>{setHideDrop(!hideDrop)}}>
                        <div className='flex-shrink-0 w-10 h-10 relative'>
                            <div className='p-1 bg-white rounded-full focus:outline-none focus:ring'>
                                <i className="fas fa-user text-gray-500 text-lg"></i>
                            </div>
                        </div>
                        <div className="p-2 md:block text-left">
                            <h2 className="text-sm font-semibold text-gray-800">{username}</h2>
                            <p className="text-xs text-gray-500">{rol}</p>
                        </div> 
                </button>
                <ul className={hideDrop?'origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-20 bg-white ring-1 ring-black ring-opacity-5':'origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden'}>
                    <li>
                        <Link href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-[#f84525] hover:bg-gray-50">
                            <i className="fas fa-user mr-2"></i> Perfil
                        </Link>
                    </li>
                    
                    <li>
                        <Form method="POST" action="/logout">
                            <button type="submit" role="menuitem" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-[#f84525] hover:bg-gray-50 cursor-pointer">
                                <i className="fas fa-sign-out-alt mr-2"></i><span className="hidden sm:inline">Cerrar sesión</span> 
                            </button>
                        </Form>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;