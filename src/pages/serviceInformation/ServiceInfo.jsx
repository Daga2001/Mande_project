import { useContext, useEffect } from "react";
import { Box, Grid, Button, IconButton, useTheme } from "@mui/material"
import * as yup from "yup";
import React from 'react';
import servicio1 from '../../assets/Servicio1.png';
import ver from '../../assets/ver.png';
import Header from "../../components/header/Header";
import "./ServiceInfo.scss";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { Context } from "../../context/ContextList";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../style/theme";

const ServiceInfo = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const context = useContext(Context);
    const navigate = useNavigate();
    const rows = [
        {id: 1, nombre: "Ejemplo", precio: 100, distancia: 1000, promedio: 500},
        {id: 2, nombre: "Ejemplo", precio: 100, distancia: 1000, promedio: 500},
        {id: 3, nombre: "Ejemplo", precio: 100, distancia: 1000, promedio: 500},
    ]
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
            width:300
        },
        {
            field: "accion",
            headerName: "Acción",
            width:100,
            renderCell: (params) => {
                return(
                    <>
            
            <IconButton
              onClick={() => {
                // console.log(params.row)
                context.setAppState({
                  stateLogin: false,
                  name: context.appState.name,
                  temporalUser: { user: params.row, roll: type },
                  dataUser: context.appState.dataUser,
                });
                navigate(url);
              }}
              aria-label="edit"
            >
              <EditIcon />
            </IconButton>
                    </>
                )
            } 
        }
    ]


  return (
    <div>
    <Header title={"Contratar Servicio"}/>
        <div className="serviceinfo">
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
              rows={rows}
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

