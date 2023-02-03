import { useContext, useEffect,useState } from "react";
import { Box, Grid, Button, IconButton, useTheme, Rating } from "@mui/material"
import * as yup from "yup";
import React from 'react';
import servicio1 from '../../assets/Servicio1.png';
import ver from '../../assets/ver.png';
import Header from "../../components/header/Header";
import "./ServiceInfo.scss";
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { tokens } from "../../style/theme";
import { Context } from "../../context/Context";
import {  headerToken } from "../../data/headertoken";

const ServiceInfo = ( {type} ) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(Context);
    const [listaTrabajadores,setListaTrabajadores] = useState([])

    const obtenerTrabajadores=async () => {
      const config=headerToken;
      const link="http://127.0.0.1:8000/mande/workers/view/"+location.state?.jid+"/"
      const response= await fetch(link,config)
      const data = await response.json()
      setListaTrabajadores(data.map(e => (
          {id:e.worker.user_id,
          nombre:e.user.f_name+" "+e.user.l_name,
          precio:e.price,
          distancia:500,
          promedio:e.worker.avg_rating}
      )))
    }


    useEffect(() => {
      obtenerTrabajadores();
    },[type]);

    const [rating, setRating] = useState(5);
    
    let columns=[
        {   
            field:"id",
            headerName: "ID",
            width:100
        },
        {
            field:"nombre",
            headerName: "Nombre",
            width:200
        },
        {
            field:"precio",
            headerName: "Precio por Hora",
            width: 200
        },
        {
            field:"distancia",
            headerName:"Distancia a mi ubicación",
            width: 200
        },
        {
            field:"promedio",
            headerName:"Promedio de estrellas",
            width:300,
            renderCell: () =>{
              return(
                <>
                {listaTrabajadores.map(e => (
                  <Rating name="promedioEstrellas" precision={0.1} value={+e.promedio} readOnly/>
                ))}
                
                </>
              )
            }
        },
        {
            field: "accion",
            headerName: "Acción",
            width:100,
            renderCell: (params) => {
                return(
                    <>
                    <Button variant="contained" onClick={() => {
                      //console.log(params.row.id)
                      navigate("../services/request", {state: 
                        {jid: location.state?.jid, 
                          title:location.state?.title, 
                          description:location.state?.description,
                          sid: params.row.id,
                          nombre:params.row.nombre,
                          distancia:params.row.distancia,
                          precio:params.row.precio,
                          rating:params.row.promedio
                        }});
                    }}>
                     Ver
                     </Button>  
                    </>
                )
            } 
        }
    ]


  return (
    <div>
    <Header title={"Contratar Servicio"}/>
    <h2>{listaTrabajadores.worker}</h2>
        <div className="serviceinfo">
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
                        <p> {location.state?.description}</p>
                    </Grid>
                </Grid>
            </Grid>
            </Grid>
        
        
        <Box m="20px">
        
          <Box
            m="40px 0 0 0"
            height="65vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.accent4[200],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.accent4[100],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.accent4[200],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.accent4[100],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.accent4[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.accent4[300]} !important`,
              },
            }}
          >
            <h2> Trabajadores Disponibles </h2>
            <DataGrid
              // checkboxSelection
              rows={listaTrabajadores}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              pageSize={10}
              style={{maxWidth:'100% !important'}}
              initialState={{
                sorting: {
                  sortModel: [{ field: "id", sort: "asc" }],
                },
              }}
            />
          </Box>
        </Box>

        </div>
    </div>
  )
}

export default ServiceInfo

