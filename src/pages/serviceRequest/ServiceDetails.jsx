import { useContext, useEffect, useState } from "react";
import { Box, Grid, Button, IconButton, useTheme, TextField, FormControl, Select, MenuItem, Rating } from "@mui/material";
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

const ServiceDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(Context);

    const [metodo,setMetodo] = useState('');
    const handleChange = (event) => {
        setMetodo(event.target.value);
      };
    const [rating, setRating] = useState(3.4);

  return (
    <div>
        <Header title={"Contratar Servicio"}/>
        <h2> {location.state?.jid} {location.state?.sid} </h2>
        <div className="serviceinfo">
            <Grid container direction="row" spacing={1} wrap='nowrap' >
                <Grid container direction="row" spacing = {1} wrap='nowrap' xs={12} sm={12} md={12} lg={7} xl={7}>
                    <Grid item>
                    <img src={servicio1} height="150" width="150"/>
                    </Grid>
                    <Grid item>
                    <Grid container direction="column" spacing={0.5} justifyContent="center" alignItems="baseline">
                        <Grid item>
                            <h2> Cuidador de Mascotas</h2>
                        </Grid>
                        <Grid item>
                            <p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate</p>
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
                            <TextField id="descripcion" variant="filled"/>
                        </FormControl>
                        </Grid>
                        <Grid item> 
                        <h2> Método de pago </h2>
                        </Grid>
                        <Grid item>
                        <FormControl fullWidth gap="30px" >
                            <Select id="selectMetodo" value={metodo} label="Metodo de Pago" onChange={handleChange}>
                                <MenuItem value={"Efectivo"}>Efectivo</MenuItem>
                                <MenuItem value={"Tarjeta"}>Tarjeta</MenuItem>
                            </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                        <FormControl fullWidth gap="30px" >
                            <Button variant="contained">Contratar </Button>
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
                value=""
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Distancia"
                value=""
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Precio por Hora"
                value=""
                />
                <h2> Rating: </h2>
                <Rating precision={0.1} value={rating} readOnly/>
                </FormControl>
            </Box>

        </div>
    </div>
  )
}
export default ServiceDetails
