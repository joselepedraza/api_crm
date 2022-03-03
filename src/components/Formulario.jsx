import React from 'react'
import { Formik, Form, Field } from 'formik' //Formulario con Formik
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup' //Validación de los datos del formulario con YUP (https://github.com/jquense/yup)

import Alerta from './Alerta';
import Spinner from './Spinner';

const Formulario = ({cliente, cargando}) => {

const navigate = useNavigate();//del hook de react-router-dom: navega a la url pasada por parametros

  //Para mapear los valores de los campos de Form (mapeados previamente en Formik) con los valores de Yup para las validaciones 
  const nuevoClienteSchema = Yup.object().shape({
    nombre: Yup.string()
                .min(3, 'El nombre es muy corto')
                .max(20, 'El nombre es muy largo')
                .required('El Nombre del Cliente es Obligatorio'),
    empresa: Yup.string()
                .required('El Nombre de la Empresa es Obligatorio'),
    email: Yup.string()
              .email('Email no válido')
              .required('El email es Obligatorio'),
    telefono: Yup.number()
              .integer('Número no válido')
              .positive('Número no válido')
              .typeError('El Número no es válido'),
  })

  //Aqui podemos enviar los datos del formulario (por Axios/FetchAPI) hacia alguna API o backend
  const handleSubmit = async (values) => {
    //console.log(values)
    try {
      let respuesta;
      if(cliente.id){ //Editando Registro
        //para actualizar un registro según los principios de REST (url/clientes/id, PUT y tipo de contenido)
        const url = `http://localhost:4000/clientes/${cliente.id}`;

        respuesta = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify(values),
          headers: {
            'Content-Type' : 'application/json' 
          }
        });

      }else{//Nuevo Registro
        //para crear un nuevo registro según los principios de REST (url/clientes, POST y tipo de contenido)
        const url = 'http://localhost:4000/clientes';

        respuesta = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type' : 'application/json' 
          }
        });

      }
      
      //console.log(respuesta);
      const resultado = await respuesta.json();
      //console.log(resultado);
      navigate('/clientes');

    } catch (error) {
      console.log(error);
    }
  }


  return (

    cargando ? <Spinner /> : (
      <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto">
        <h1 className="text-gray-600 font-bold text-xl uppercase text-center"> {cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"} </h1>

    
        <Formik
          initialValues={{
            /*nombre: '',
            empresa: '',
            email: '',
            telefono: '',
            notas: ''*/
            nombre: cliente?.nombre ?? "",  //si cliente.nombre = undefined ponemos '' si no ponemos cliente.nombre ==> cliente.nombre ? cliente.nombre : ""
            empresa: cliente?.empresa ?? "",
            email: cliente?.email ?? "",
            telefono: cliente?.telefono ?? "",
            notas: cliente?.notas ?? ""
          }}
          enableReinitialize={true}
          onSubmit = { async (values, {resetForm}) => {
            //console.log(values)
            await handleSubmit(values);

            resetForm();
          }}

          //Para que el formulario sepa donde buscar el esquema de nuestro formulario
          validationSchema={nuevoClienteSchema}
        >
          {({errors, touched}) => {
            //console.log(data);
            console.log(touched);
            return (
            //Este arrow function conecta los valores iniciales con este Form (con el atributo name de Field)
              <Form
                className="mt-10"
              >
                <div className="mb-4">
                  <label
                    className="text-gray-800"
                    htmlFor="nombre"
                  >Nombre: </label>         
                  <Field 
                    id="nombre"
                    type="text"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder="Nombre del Cliente"
                    name="nombre"
                  />

                  {errors.nombre && touched.nombre ? (
                    <Alerta>{errors.nombre}</Alerta>
                  ) : null}

                </div>

                <div className="mb-4">
                  <label
                    className="text-gray-800"
                    htmlFor="empresa"
                  >Empresa u organización: </label>         
                  <Field 
                    id="empresa"
                    type="text"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder="Empresa del Cliente"
                    name="empresa"
                  />

                  {errors.empresa && touched.empresa ? (
                    <Alerta>{errors.empresa}</Alerta>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="text-gray-800"
                    htmlFor="email"
                  >Email: </label>         
                  <Field 
                    id="email"
                    type="email"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder="Email del Cliente"
                    name="email"
                  />

                  {errors.email && touched.email ? (
                    <Alerta>{errors.email}</Alerta>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="text-gray-800"
                    htmlFor="telefono"
                  >Teléfono: </label>         
                  <Field 
                    id="telefono"
                    type="tel"
                    className="mt-2 block w-full p-3 bg-gray-50"
                    placeholder="Teléfono del Cliente"
                    name="telefono"
                  />

                  {errors.telefono && touched.telefono ? (
                    <Alerta>{errors.telefono}</Alerta>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="text-gray-800"
                    htmlFor="notas"
                  >Notas: </label>         
                  <Field 
                    as="textarea"
                    id="notas"
                    type="tel"
                    className="mt-2 block w-full p-3 bg-gray-50 h-40"
                    placeholder="Notas del Cliente"
                    name="notas"
                  />
                </div>

                <input 
                  type="submit"
                  value= {cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"} 
                  className="mt-5 w-full bg-blue-800 p-3 text-white font-bold uppercase text-lg"
                />
              </Form>

          )}}

        </Formik>
      </div>
    )
  )
}

//Si el prop cliente no está (venimos de nuevo cliente) toma estos valores iniciales, si si está presente (venimos de editar cliente) toma los valores iniciales del cliente en cuestión
Formulario.defaultProps = {
  cliente: {},
  cargando: false
}

export default Formulario
