import './App.css';
import axios from 'axios';
import React, {useEffect,useState} from 'react';
import {Table,TableContainer,TableHead,TableCell,TableBody,TableRow,Modal,Button,TextField} from '@material-ui/core'
import  {Edit,Delete,Visibility} from '@material-ui/icons'
import {makeStyles} from '@material-ui/core/styles'

//url de la api construida en node
const baseUrl = 'http://localhost:8090/api/clients/'
//clase de estilos
const useStyles = makeStyles((theme) =>({
  modal:{
    position: 'absolute',
    width:400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding:theme.spacing(2,4,3),
    top:' 50%',
    left: '50%',
    transform : 'translate(-50%, -50%)'
  },
  iconos:{
    cursor : 'pointer'
  },
  inputMaterial:{
    width:'100%'
  }
}))
//funcion principal
function App() {
  const styles = useStyles();
  const [data,setData] =useState([]);
  const [modalInsertar,setModalInsertar] = useState(false);
  const [modalEditar,setModalEditar] = useState(false);
  const [modalEliminar,setModalEliminar] = useState(false);
  const [modalVer,setModalVer] = useState(false);
  
  const [clienteSeleccionado,setClienteSeleccionado] = useState({
    nombre: '',
    apellidoPaterno:'',
    apellidoMaterno:'',
    rfc:'',
    curp:''
  })
  const handleChange=e=>{
    const {name,value}= e.target;
    setClienteSeleccionado(prevState=>({
      ...prevState,
      [name]:value
    }))
    console.log(clienteSeleccionado);
  }
  //llamado a peticion que devuelve todos los clientes
  const peticionGet=async()=>{
   await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    })
  }

  //lamado a peticion para regitrar un cliente
  const peticionPost=async()=>{
    await axios.post(baseUrl,clienteSeleccionado)
     .then(response=>{
       setData(data.concat(response.data));
       abrirCerrarModalInsertar();
     })
   }

   //llamado a peticion para editar un cliente
   const peticionPut=async()=>{
     await axios.put(baseUrl+clienteSeleccionado.idCLiente,clienteSeleccionado)
     .then(response=>{
      var dataNueva=data;
      dataNueva.map(cliente=>{
        if(clienteSeleccionado.idCLiente===cliente.idCliente){
          cliente.nombre=clienteSeleccionado.nombre;
          cliente.apellidoPaterno=clienteSeleccionado.apellidoPaterno;
          cliente.apellidoMaterno=clienteSeleccionado.apellidoMaterno;
          cliente.rfc=clienteSeleccionado.rfc;
          cliente.curp=clienteSeleccionado.curp;        }
      })
      setData(dataNueva); 
      abrirCerrarModalEditar();
     })
     
   }

   //llamado peticion eliminar 
   const peticionDelete =async()=>{
     await axios.delete(baseUrl+clienteSeleccionado.idCLiente)
     .then(response=>{
       setData(data.filter(cliente=>cliente.idCliente!==clienteSeleccionado.idCliente));
       abrirCerrarModalEliminar();
     })
   }

   //llamado a peticion para ver detalles de cuentas
   
   const peticionGetOne=async()=>{
     await axios.get(baseUrl+clienteSeleccionado.idCLiente)
     .then(response=>{
       console.log(data)
     })
   }

  //control de modal insertar
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const abrirCerrarModalVer=()=>{
    setModalVer(!modalVer);
  }

  function verCliente(cliente){
    peticionGetOne();
    seleccionarCliente(cliente,'Ver')

  }
  //editar eliminar 
  const seleccionarCliente=(cliente,caso)=>{
    setClienteSeleccionado(cliente);
    if(caso==='Editar')abrirCerrarModalEditar()
    else if (caso==='Eliminar')abrirCerrarModalEliminar()
    else if (caso==='Ver')abrirCerrarModalVer()
  }
  useEffect(()=>{
    async function fetchData(){
      await peticionGet();
    }
    fetchData();
  },[])
  //constructor cuerpo modal insercion
  const bodyInsertar=(
   <div className= {styles.modal} >
     <h3>Agregar cliente</h3>
     <TextField name = "nombre" className= {styles.inputMaterial} label="Nombre" onChange={handleChange}/>
     <br/>
     <TextField name = "apellidoPaterno" className= {styles.inputMaterial} label="Apellido Paterno" onChange={handleChange}/>
     <br/>
     <TextField name = "apellidoMaterno" className= {styles.inputMaterial} label="Apellido Materno" onChange={handleChange}/>
     <br/>
     <TextField name = "rfc" className= {styles.inputMaterial} label="RFC" onChange={handleChange}/>
     <br/>
     <TextField name = "curp" className= {styles.inputMaterial} label="CURP" onChange={handleChange}/>
     <br/><br/>
     <div align ='right'>
       <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
       <Button onClick= {()=>abrirCerrarModalInsertar()}>Cancelar</Button>
     </div>
   </div>
   
  )

  const bodyEditar=(
    <div className= {styles.modal} >
      <h3>Editar cliente</h3>
      <TextField name = "nombre" className= {styles.inputMaterial} label="Nombre" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.nombre}/>
      <br/>
      <TextField name = "apellidoPaterno" className= {styles.inputMaterial} label="Apellido Paterno" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.apellidoPaterno}/>
      <br/>
      <TextField name = "apellidoMaterno" className= {styles.inputMaterial} label="Apellido Materno" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.apellidoMaterno}/>
      <br/>
      <TextField name = "rfc" className= {styles.inputMaterial} label="RFC" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.rfc}/>
      <br/>
      <TextField name = "curp" className= {styles.inputMaterial} label="CURP" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.curp}/>
      <br/><br/>
      <div align ='right'>
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick= {()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
    
   )

   const bodyEliminar=(
    <div className= {styles.modal} >
      <p>¿Estás seguro que deseas eliminar el cliente <b>{clienteSeleccionado && clienteSeleccionado.nombre}</b>?</p>
      <div align ='right'>
        <Button color="primary" onClick={()=>peticionDelete()}>Si</Button>
        <Button onClick= {()=>abrirCerrarModalEliminar()}>Cancelar</Button>
      </div>
    </div>
    
   )

   const bodyVer=(
    <div className= {styles.modal} >
      <h3>Ver detalles de cliente</h3>
      <TextField name = "nombre" className= {styles.inputMaterial} label="Nombre" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.nombre}/>
      <br/>
      <TextField name = "apellidoPaterno" className= {styles.inputMaterial} label="Apellido Paterno" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.apellidoPaterno}/>
      <br/>
      <TextField name = "apellidoMaterno" className= {styles.inputMaterial} label="Apellido Materno" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.apellidoMaterno}/>
      <br/>
      <TextField name = "rfc" className= {styles.inputMaterial} label="RFC" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.rfc}/>
      <br/>
      <TextField name = "curp" className= {styles.inputMaterial} label="CURP" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.curp}/>
      <br/>
      <TextField name = "saldoCuenta" className= {styles.inputMaterial} label="Saldo" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.saldoCuenta}/>
      <br/>
      <TextField name = "nombreCuenta" className= {styles.inputMaterial} label="Cuenta" onChange={handleChange} value ={clienteSeleccionado && clienteSeleccionado.nombreCuenta}/>
      <br/><br/>
      <div align ='right'>
        <Button onClick= {()=>abrirCerrarModalVer()}>Salir</Button>
      </div>
    </div>
    
   )
  //estructura html a renderizar
  return (
    <div className="App">
      <br/>
      <Button onClick = {()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido Paterno</TableCell>
              <TableCell>Apellido Materno</TableCell>
              <TableCell>RFC</TableCell>
              <TableCell>CURP</TableCell>
              <TableCell>Fecha Alta</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(cliente=>(
              <TableRow key= {cliente.idCLiente}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.apellidoPaterno}</TableCell>
                <TableCell>{cliente.apellidoMaterno}</TableCell>
                <TableCell>{cliente.rfc}</TableCell>
                <TableCell>{cliente.curp}</TableCell>
                <TableCell>{cliente.fechaAlta}</TableCell>
                <TableCell>
                  <Edit className= {styles.iconos} onClick={()=>seleccionarCliente(cliente,'Editar')} />
                  &nbsp;&nbsp;&nbsp;
                  <Delete className= {styles.iconos} onClick={()=>seleccionarCliente(cliente,'Eliminar')} />
                  &nbsp;&nbsp;&nbsp;
                  <Visibility className= {styles.iconos} onClick={()=>verCliente(cliente)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open = {modalInsertar} 
      onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>
      <Modal open = {modalEditar} 
      onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>
      <Modal open = {modalEliminar} 
      onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>

      <Modal open = {modalVer} 
      onClose={abrirCerrarModalVer}>
        {bodyVer}
      </Modal>
      
      
    </div>
  );
}

export default App;
