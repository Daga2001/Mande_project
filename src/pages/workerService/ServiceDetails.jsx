import { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  IconButton,
  useTheme,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import * as yup from "yup";
import React from "react";
import servicio1 from "../../assets/Servicio1.png";
import estrellafull from "../../assets/estrellafull.png";
import estrella from "../../assets/estrella.png";
import ver from "../../assets/ver.png";
import Header from "../../components/header/Header";
import "./ServiceDetails.scss";
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Context } from "../../context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../style/theme";
import {  headerToken } from "../../data/headertoken";


const ServiceDetails = ( {type} ) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const context = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [metodo,setMetodo] = useState('');
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [datosServicio,setDatosServicio] = useState([])
    const [estado,setEstado] = useState("")
    const [datosCliente,setDatosCliente] = useState([])
    const [nombre,setNombre]= useState("")
    const [direccion,setDireccion] = useState("")
    const [email,setEmail] = useState("")
    const [cambiado,setCambiado] = useState(false)
    const [click,setClick] = useState(0)

    const handleChange = (event) => {
        setMetodo(event.target.value);
      };
//FINAL
      const obtenerDatosCliente = async() => {
        const config={
          method: "POST",
          headers: { 
            "Content-type": "application/json" ,
            Authorization: window.localStorage.loginUser
          },
          body:JSON.stringify({
            "sid":location.state?.sid
          })
        }
        const link="http://127.0.0.1:8000/mande/worker/service/client/info"
          const response = await fetch(link,config)
          const data = await response.json()
          console.log(location.state?.sid)
          console.log(data)
          setDatosCliente(data)
        }

    const obtenerDatosServicio= async() => 
  {
    const config = {
      method: "POST",
      headers: { 
        "Content-type": "application/json" ,
        Authorization: window.localStorage.loginUser
      },
      body:JSON.stringify({
        "sid":location.state?.sid
      })
    }
    fetch("http://127.0.0.1:8000/mande/service/view",config).then((res) => res.json()).then((res) => 
    {
    setDatosServicio(res)
    })
    console.log("datosServicio:",datosServicio)
  }
    const enviarCorreo = async() => {
        const config = {
            method: 'POST',
            headers: headerToken.headers,
            body: JSON.stringify({"sid":location.state?.sid})
          }
          const link="http://127.0.0.1:8000/mande/user/notify"
          const response = await fetch(link,config)
          const data = await response.json()
          console.log(data)
    }

    const cambiarEstado = async() => {
    const config = {
      method: "PUT",
      headers: { 
        "Content-type": "application/json" ,
        Authorization: window.localStorage.loginUser
      },
      body: JSON.stringify(
        {
        'sid':datosServicio[0].sid,
        'rating':datosServicio[0].rating,
        'status':estado,
        'description':datosServicio[0].description,
        'client_id':datosServicio[0].client.user_id,
        'worker_id':datosServicio[0].worker.user_id,
        'jid':datosServicio[0].job.jid,
        'card_num':datosServicio[0].card_num
      })}
        const link = "http://127.0.0.1:8000/mande/service/info/update"
        fetch(link,config).then((res)=> res.json()).then((res)=>{console.log(res)})
    }

    const handleButtonClick1 = () => {
        
        setEstado("Aceptado")
        obtenerDatosServicio()
        cambiarEstado()
       enviarCorreo()
       if(click == 2){
        setShow(prev => !prev);
        navigate("../home")
       }else{
        setClick(click+2)
       }
      
    }
    const handleButtonClick2 = () => {
      
      setEstado("Rechazado")
      obtenerDatosServicio()
      cambiarEstado()
     enviarCorreo()
     if(click == 2){
      setShow(prev => !prev);
      navigate("../home")
     }else{
      setClick(click+2)
     }
  }

    const cargarDatos = () => {
      obtenerDatosCliente()
      setNombre(datosCliente[0].nombre + " " + datosCliente[0].apellido)
      setDireccion("Calle: "+ datosCliente[0].direccion.calle + " Ciudad: " + datosCliente[0].direccion.ciudad + " Pais: " + datosCliente[0].direccion.pais + " Codigo Postal: " + datosCliente[0].direccion.cod_postal)
      setEmail(datosCliente[0].email)
    }

    const Finalizar = () =>
    {
        setEstado("Terminado")
        obtenerDatosServicio()
        cambiarEstado()
        enviarCorreo()
        if(click == 2){
          setShow2(prev => !prev);
          navigate("../home")
         }else{
          setClick(click+2)
         }
    }

    const cambiarBoton = () =>
    {
      if(cambiado==false) {
        if(location.state?.estado == "Aceptado" || location.state?.estado == "Rechazado" || location.state?.estado == "Terminado"){
        setShow(false);
        setShow2(true);
        }
        else{
          setShow(true);
          setShow2(false);
        }
        setCambiado(true)
      }
    }

    useEffect(() => {
    cambiarBoton()
    },[type])


  return (
    <div>
        <Header title={"Contratar Servicio"}/>
        <div className="serviceinfo">
            <Grid container direction="row" spacing={1} wrap='nowrap' >
                <Grid container direction="row" spacing = {1} wrap='nowrap' xs={12} sm={12} md={12} lg={7} xl={7}>
                    <Grid item>
                    <img src={servicio1} height="150" width="150"/>
                    </Grid>
                    <Grid item>
                    <Grid container direction="column" spacing={0.5} justifyContent="center" alignItems="baseline">
                        <Grid item>
                            <h2> {location.state?.title}</h2>
                        </Grid>
                        <Grid item>
                            <p> {location.state?.description} </p>
                        </Grid>
                      </Grid>
                   </Grid>
                  </Grid>
                   <Grid item>
                    <Box  gap="30px" sx={{boxShadow:9, border: 1}} >
                    <Grid container direction="column" spacing = {1}   style={{width: "500px"}} alignItems="center" justifyContent="flex-end" wrap='nowrap'>  
                        <Grid item>
                        <h2> Paso Final</h2>
                        </Grid>
                        <Grid item>
                        {show && (
                            <Grid container direction="row" spacing={3} id="trabajo">
                                
                                <Grid item>
                                <Button variant="contained" onClick={() => handleButtonClick1()}>Aceptar Trabajo</Button>
                                </Grid>
                                <Grid item>
                                <Button variant="contained" onClick={() => handleButtonClick2()}>Rechazar Trabajo </Button>
                                </Grid> 
                            </Grid>)}
                        {show2 && (<Grid item id="terminar" visibility={false}>
                            <Button variant="contained" onClick={() => Finalizar()}>Terminar y Notificar Servicio </Button>
                            </Grid>)}
                        </Grid>
                        
                    </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Box gap="30px">
                <h2>INFORMACIÓN DEL SOLICITANTE</h2>
                <FormControl fullWidth gap="30px" >
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Nombre"
                value={nombre}
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Direccion"
                value={direccion}
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Correo"
                value={email}
                />
                </FormControl>
                <Button variant="contained" onClick={cargarDatos}> Cargar Datos del Cliente </Button>
            </Box>

        </div>
    </div>
  )
}
export default ServiceDetails
