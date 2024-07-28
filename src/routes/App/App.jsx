import * as React from 'react';
import { Outlet,
  redirect,
  useLoaderData,
 } from 'react-router-dom';
import './App.css';
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar';
import { authProvider } from '../../auth';

export async function loader({ request }){
  if(!authProvider.isAuthenticated){
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }

  const username = authProvider.username;
  const rol = authProvider.rol;
  const saldo = authProvider.saldo;

  return {username, rol, saldo};
}

function App() {
  const { username, rol, saldo } = useLoaderData();

  const [eventResult, setEventResult] = React.useState(null);

    const handleChildClick = (result) => {
        // Hacer algo con el resultado, como establecerlo en el estado del componente padre
        setEventResult(result);
      };

  return (
    <>
      <div className="flex flex-col h-screen ">

            <Header onClick={handleChildClick} username={username} rol={rol} saldo={saldo}/>

          <div className="flex-1 flex ">

            <Sidebar hide={eventResult} />

            <main className="flex-1 p-4 ">
                <Outlet />
            </main>

          </div>

      </div>
    </>
  )
}

export default App
