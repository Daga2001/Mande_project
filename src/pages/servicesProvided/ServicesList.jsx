import { Box, Grid, Button } from "@mui/material"
import * as yup from "yup";
import React from 'react';
import servicio1 from '../../assets/Servicio1.png';
import Header from "../../components/header/Header";
import "./ServicesList.scss";
import { useNavigate } from "react-router-dom";

const ServicesList = () => {
    const navigate = useNavigate();


  return (
    
    <div>
    <Header title={"Servicios"} subtitle={"Servicios de la app"}/>

    <div className="servicelist">
        
        <Grid container spacing = {10} alignItems="flex-start" >
            <Grid item>
                <Box sx={{boxShadow:9}} className="boxcolor">
                <Grid container direction="column" spacing={0.5} justifyContent="center" alignItems="center" >
                <Grid item>
                    <h2> Cuidador de Mascotas</h2>
                </Grid>
                <Grid item>
                    <h3> Cuida tu mascota </h3>
                    </Grid>
                    <Grid item>
                <img src={servicio1} height="150" width="150"/>
                </Grid>
                <Grid item> 
                <Button variant="contained">Ver servicio </Button>
                </Grid>
              </Grid>
              </Box>
            </Grid> 

            <Grid item>
                <Box sx={{boxShadow:9}} className="boxcolor">
                <Grid container direction="column" spacing={0.5} justifyContent="center" alignItems="center" >
                <Grid item>
                    <h2> Cuidador de Mascotas</h2>
                </Grid>
                <Grid item>
                    <h3> Cuida tu mascota </h3>
                    </Grid>
                    <Grid item>
                <img src={servicio1} height="150" width="150"/>
                </Grid>
                <Grid item> 
                <Button variant="contained">Ver servicio </Button>
                </Grid>
              </Grid>
              </Box>
            </Grid> 
            
        </Grid>
        
    </div>
    </div>
  )
}

export default ServicesList

