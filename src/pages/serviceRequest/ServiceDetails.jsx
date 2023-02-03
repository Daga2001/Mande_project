import { useContext, useEffect, useState } from "react";
import { Box, Grid, Button, IconButton, useTheme, TextField, FormControl, Select, MenuItem, Rating, Alert, AlertTitle } from "@mui/material";
import * as yup from "yup";
import React from 'react';
import servicio1 from '../../assets/Servicio1.png';
import estrellafull from '../../assets/estrellafull.png';
import estrella from '../../assets/estrella.png';
import ver from '../../assets/ver.png';
import Header from "../../components/header/Header";
import "./ServiceDetails.scss";
import { Link, useNavigate,useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../style/theme";
import { Context } from "../../context/Context";
//import {  headerToken } from "../../data/headertoken";

const ServiceDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(Context);
    const [descripcion,setDescripcion] = useState('');
    const [numeroTarjeta,setNumeroTarjeta] = useState(0);
    const [tipoTarjeta, setTipoTarjeta] = useState("");
    const [fechaExpiracion,setFechaExpiracion] = useState("");
    const [cvv, setCvv] = useState(0);
    const [correo,setCorreo] = useState("")
    const [sid,setSID] = useState("")
    const headerToken = {
        headers: {
          Authorization: `Token fe76dead69219edc32190e91a8d350febcb601cc`,
          "Content-type": "application/json",
        },
      };
    const handleChange = (event) => {
        setDescripcion(event.target.value);
    };
    const handleChangeNum = (event) => {
        setNumeroTarjeta(event.target.value);
    };
    const handleChangeTipo = (event) => {
        setTipoTarjeta(event.target.value);
    };
    const handleChangeFecha = (event) => {
        setFechaExpiracion(event.target.value);
    };
    const handleChangeCvv = (event) => {
        setCvv(event.target.value);
    };
    
    const validateData = async () => {
        const config = {
            method: 'POST',
            headers: headerToken.headers,
            body:JSON.stringify({
                "num":numeroTarjeta,
                "type":tipoTarjeta,
                "expiration_dt":fechaExpiracion,
                "cvv":cvv
            })
          }
          const link="http://127.0.0.1:8000/mande/paymentMethod/validate"
          const response = await fetch(link,config)
          const data= await response.json();
          console.log (data)
    }

    const obtenerCorreo = async() => {
        const config = headerToken;
        const link = "http://127.0.0.1:8000/mande/user/view"
        const response=await fetch(link,config)
        const data = await response.json()
        setCorreo(data.user.email)
    }

    const enviarCorreo = async() => {
        const config = {
            method: 'POST',
            headers: headerToken.headers,
            body: JSON.stringify({"sid":1})
          }
          const link="http://127.0.0.1:8000/mande/user/notify"
          const response = await fetch(link,config)

    }

    const handleClick = () => {
        if (validateData())
        {
            setSID(location.state?.sid)
            obtenerCorreo()
            enviarCorreo()
        }
        else{
           
        }
        
    }

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
                            <h2> {location.state?.title} </h2>
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
                            <p> Precio hora: 1000% </p>
                        </Grid>
                        <Grid item>
                            <p> Añada una descripción al favor a realizar </p>
                        </Grid>
                        <Grid item >
                        <FormControl fullWidth gap="30px" >
                            <TextField value={descripcion} onChange={handleChange} id="descripcion" variant="filled"/>
                        </FormControl>
                        </Grid>
                        <Grid item>
                            <p> Añada la información de la tarjeta</p>
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth gap="30px">
                                <TextField value={numeroTarjeta} onChange={handleChangeNum} label="Numero de Tarjeta" variant="filled"/>
                                <TextField value={tipoTarjeta} onChange={handleChangeTipo} label="Tipo de Tarjeta" variant="filled"/>
                                <TextField value={fechaExpiracion} onChange={handleChangeFecha} label="Fecha de Expiracion" variant="filled"/>
                                <TextField value={cvv} onChange={handleChangeCvv}  label="Numero Cvv" variant="filled"/>
                            </FormControl>
                        </Grid>
                        <Grid item>
                        <FormControl fullWidth gap="30px" >
                            <Button variant="contained" onClick={handleClick}>Contratar </Button>
                        </FormControl>
                        </Grid>
                    </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Box gap="30px">
                <h2>INFORMACIÓN DEL TRABAJADOR</h2>
                <FormControl fullWidth gap="30px" >
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Nombre"
                value={location.state?.nombre}
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Distancia"
                value={location.state?.distancia}
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Precio por Hora"
                value={location.state?.precio}
                />
                <h2> Rating: </h2>
                <Rating precision={0.1} value={location.state?.rating} readOnly/>
                </FormControl>
            </Box>

        </div>
    </div>
  )
}
export default ServiceDetails