import {useEffect, useState} from 'react';
import {useParams } from 'react-router-dom';
import Formulario from '../components/Formulario';

const EditarCliente = () => {
  
  const [ cliente, setCliente ] = useState({});
  const [cargando, setCargando ] = useState(true);

  const { id } = useParams(); //para leer parametros de la url
  
  useEffect( () => {
      //setCargando(!cargando);
      const obtenerClienteAPI = async () => {
          try {
              const url = `http://localhost:4000/clientes/${id}`
              const respuesta = await fetch(url);

              const resultado = await respuesta.json();
              //console.log(resultado);
              setCliente(resultado);
          } catch (error) {
              console.log(error);
          }

          setTimeout(() => {
              setCargando(!cargando);
          },1000)

      }
      obtenerClienteAPI();
  }, []);//cuando este listo el componente hacemos peticion a la API

  return (
    <>
      <h1 className="font-black text-4xl text-blue-900"> Editar Cliente </h1>
      <p className="mt-3"> Utiliza este formulario para editar los datos del cliente </p>
    
      {cliente?.nombre ? (
        <Formulario 
          cliente={cliente}
          cargando={cargando}
        />
      ): <p>ID de Cliente No Válido</p>}

    </>
  )
}

export default EditarCliente
