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

const ServiceDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const context = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [metodo,setMetodo] = useState('');
    const [show, setShow] = useState(true);
    const [show2, setShow2] = useState(false);
    const handleChange = (event) => {
        setMetodo(event.target.value);
      };
    
    const handleButtonClick1 = () => {
        setShow(prev => !prev);
        setShow2(prev => !prev);
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
                            <h2> {location.state?.title}</h2>
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
                        {show && (
                            <Grid container direction="row" spacing={3} id="trabajo">
                                
                                <Grid item>
                                <Button variant="contained" onClick={handleButtonClick1}>Aceptar Trabajo</Button>
                                </Grid>
                                <Grid item>
                                <Button variant="contained" onClick={handleButtonClick1}>Rechazar Trabajo </Button>
                                </Grid> 
                            </Grid>)}
                        {show2 && (<Grid item id="terminar" visibility={false}>
                            <Button variant="contained">Terminar y Notificar Servicio </Button>
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
                value=""
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Direccion"
                value=""
                />
                <TextField
                disabled
                variant="filled"
                type="text"
                label="Metodo de pago"
                value=""
                />
                <h2> Descripcion del Trabajo </h2>
                <p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate </p>
                <Button variant="contained"> Verificar Dirección </Button>
                </FormControl>
            </Box>

        </div>
    </div>
  )
}
export default ServiceDetails
