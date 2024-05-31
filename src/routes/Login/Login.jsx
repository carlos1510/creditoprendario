import * as React from "react";
import { Form, redirect, useActionData, useLocation, useNavigation } from "react-router-dom";
import './styles.css';
import { useTitle } from "../../components/Title/Title";
import { authProvider } from "../../auth";

export async function action({ request }){
    let formData = await request.formData();
    let username = formData.get("username");
    let password = formData.get("password");

    try{
        await authProvider.login(username, password);
    }catch(error){
        return { error: "Invalid login", };
    }

    let redirectTo = formData.get("redirectTo");

    return redirect("/");
}

function Login(){
    useTitle('Login');

    const actionData = useActionData();
    const navigation = useNavigation();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get("from");

    return (
        <>
            <div
                className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
                
            </div>
            <div
                className="relative   min-h-screen  sm:flex sm:flex-row  justify-center bg-transparent rounded-3xl shadow-xl">
                <div className="flex-col flex  self-center lg:px-14 sm:max-w-4xl xl:max-w-md  z-10">
                    <div className="self-start hidden lg:flex flex-col  text-gray-300">
                        
                        <h1 className="my-3 font-semibold text-4xl">Bienvenido</h1>
                        <p className="pr-3 text-sm opacity-75">Aplicativo web para registro de Credito Prendario</p>
                    </div>
                </div>

                <div className="flex justify-center self-center  z-10">
                    <div className="p-12 bg-white mx-auto rounded-3xl w-96 ">
                        <div className="mb-7">
                            <h3 className="font-semibold text-2xl text-gray-800">Login </h3>
                            
                        </div>
                        <Form className=" space-y-6" method="POST">
                            {redirectTo && (
                                <input type="hidden" name="redirectTo" value={redirectTo} />
                            )}
                            <div >
                                <div className="pb-2">
                                    <label>Usuario</label>
                                    <input className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" 
                                        type="text" 
                                        id="username"
                                        placeholder="Usuario" 
                                        name="username"
                                        required
                                    />
                                </div>

                                <div className="relative pb-5 pt-2" >
                                    <label>Password</label>
                                    <input type="password" 
                                        placeholder="Password" 
                                        className="w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" 
                                        id="password"
                                        name="password"
                                        required
                                    />
                                </div>


                                <div className="flex items-center justify-between">

                                    {/* <div className="text-sm ml-auto">
                                        <a href="#" className="text-purple-700 hover:text-purple-600">
                                            Olvidaste la contraseña?
                                        </a>
                                    </div> */}
                                </div>
                                <div className="login-box">
                                    <button className="w-full flex justify-center bg-purple-800  hover:bg-purple-700 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500" 
                                        type="submit"
                                    >
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        Login
                                    </button>
                                </div>
                            </div>
                            {actionData?.error && (
                                <p className="text-red-500">{actionData.error}</p>
                            )}
                        </Form>
                        <div className="mt-7 text-center text-gray-400 text-xs">
                            <span>
                                Copyright © 2023
                                <a href="#" rel="" target="_blank" title="Carlos Vasquez" className="text-purple-500 hover:text-purple-600 ">CCVC</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <svg className="absolute bottom-0 left-0 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#fff" d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path></svg>
        </>
    );
}

export default Login;