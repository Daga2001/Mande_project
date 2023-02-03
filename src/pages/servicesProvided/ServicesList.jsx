import { Box, Grid, Button } from "@mui/material"
import { useContext, useEffect,useState } from "react";
import * as yup from "yup";
import React from 'react';
import servicio1 from '../../assets/Servicio1.png';
import Header from "../../components/header/Header";
import "./ServicesList.scss";
import { useNavigate } from "react-router-dom";
import {  headerToken } from "../../data/headertoken";
import { Context } from "../../context/Context";

const ServicesList = ( {type} ) => {
    const navigate = useNavigate();
    const [datosTrabajo,setDatosTrabajo] = useState([])
    const context = useContext(Context);

    const obtenerTrabajos=async () => {
      const config = headerToken;
      const link = "http://127.0.0.1:8000/mande/jobs/view"
      const response=await fetch(link,config)
      const data = await response.json()
      setDatosTrabajo(data)
    }

    const handleClick= (value) => {
      navigate("./info", {state: {jid:value.jid , title:value.occupation, description:value.j_description}});
    }
    
    useEffect(() => {
      obtenerTrabajos();
      },[type]);

  return (
    
    <div>
    <Header title={"Servicios"} subtitle={"Servicios de la app"}/>
    <div className="servicelist">
        
        <Grid container spacing = {10} alignItems="flex-start" >
        {datosTrabajo.map( e => (
        <Grid item>
        <Box sx={{boxShadow:9}} className="boxcolor">
        <Grid container direction="column" spacing={0.5} justifyContent="center" alignItems="center" >
        <Grid item>
            {<h2> {e.occupation} </h2>}
        </Grid>

        <Grid item>
        <img src={servicio1} height="150" width="150"/>
        </Grid>

        <Grid item> 
        <Button variant="contained" onClick={() => handleClick(e)} >Ver servicio </Button>
        </Grid>
      </Grid>
      </Box>
    </Grid> 
      ))}
        </Grid>
        
    </div>
    </div>
  )
}

export default ServicesList

