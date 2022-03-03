import { useEffect, useState } from 'react'
import Cliente from '../components/Cliente';

const Inicio = () => {
  
  const [clientes, setClientes] = useState([]);
  
  //Para consultar la API cuando el componente esté listo usamos el useEffect una sola vez([])
  useEffect(() => {
    const obtenerClientesAPI = async () => {
      try {
        const url = import.meta.env.VITE_API_URL;//'http://localhost:4000/clientes';
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        
        setClientes(resultado);
      } catch (error) {
        console.log(error);
      }
    }

    obtenerClientesAPI();
  }, [])

  const handleEliminar = async id => {
    const confirmar = confirm('¿Desea eliminar este cliente permanentemente?');
    //console.log("Eliminando...", id);
    if (confirmar){
      try {
        const url = `${import.meta.env.VITE_API_URL}/${id}`
        const respuesta = await fetch(url, {
          method: 'DELETE'
        })

        await respuesta.json();

        //location.reload(); //nunca recargar app de esta forma porque vuelve a consultar a la API, mejor usar el state:
        const arrayClientes = clientes.filter( cliente => cliente.id !== id);
        setClientes(arrayClientes);
      } catch (error) {
        console.log(error);
      }
    }
  }
   
  return (
    <>
      <h1 className="font-black text-4xl text-blue-900"> Clientes </h1>
      <p className="mt-3"> Administra tus clientes </p>

      <table className="w-full mt-5 table-auto shadow bg-white">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="p-3"> Nombre </th>
            <th className="p-3"> Contacto </th>
            <th className="p-3"> Empresa </th>
            <th className="p-3"> Acciones </th>
          </tr>
        </thead>

        <tbody>
          { clientes.map( cliente => (
            <Cliente 
              key={cliente.id}
              cliente={cliente}
              handleEliminar={handleEliminar}
            />
          ))}
        </tbody>
      </table>


    </>
  )
}

export default Inicio
