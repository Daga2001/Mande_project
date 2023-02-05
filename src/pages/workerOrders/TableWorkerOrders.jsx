import React from 'react';
import {Box,Button, Table, TableBody, TableCell, TableHead, TableContainer, TablePagination,TableRow,Paper} from '@mui/material';
import { useState, useEffect } from "react";
import {  headerToken } from "../../data/headertoken";
import { useNavigate, useLocation } from "react-router-dom";
import * as utils from '../../utils/utils'
import CircularProgress from "@mui/material/CircularProgress";

const TableOrders = ( {type} ) => {

  const navigate = useNavigate()
  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'servicio', label: 'Servicio Prestado', minWidth: 100 },
    { id: 'description', label: 'Comentario del cliente', minWidth: 100 },
    { id: 'estado', label: 'Estado', minWidth: 100 },
    { id: 'accion', label: 'Acción', minWidth: 75 },
  ];
  
  function createData(id, servicio, estadoPago, aceptado, terminado, accion) {
    return {id, servicio, estadoPago, aceptado, terminado, accion};
  }

  // const data = [
  //   createData(1, 'Cerrajero', 'Pagado', 'Sí', 'Sí', 'Ver'),
  //   createData(2, 'Plomero', 'No Pagado', 'No', '-', 'Ver'),
  //   createData(3, 'Carpintero', 'Pagado', 'Si', 'Sí', 'Ver'),
  //   createData(4, 'Carnicero', 'No Pagado', 'No', '-', 'Ver'),
  //   createData(5, 'Arquero', 'Pagado', 'Sí', 'Sí', 'Ver'),
  // ];

  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [loading, setLoading] = React.useState(true);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Obtiene el historial del cliente
  async function obtenerHistorial() {
    const config = {
      method: "GET",
      headers: { 
        "Content-type": "application/json" ,
        Authorization: window.localStorage.loginUser
      },
      // body: JSON.stringify(data)
    }
    // console.log("config:", config)
    const datos = await utils.consultarHistorial(config);
    console.log("datos:", datos)

    let datosProcesados = []
    for (let i = 0; i < datos.length; i++) {
      datosProcesados.push({
        id: datos[i].hid,                                                                                                                                                                                                                                                                                                         
        servicio: datos[i].job,
        description: datos[i].service.description,
        aceptado: datos[i].service.status,
        serid: datos[i].sid,
      })
    }
    console.log("datos2:", datosProcesados)
    setData(datosProcesados)
  }

  const handleClick= (value) => {
    console.log(value.serid)
    navigate("../service", {state: {sid:value.serid , title:value.servicio, description:value.description,estado:value.aceptado}});
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
        {loading ? (
          <>
            <Box
              width={"100%"}
              height={"calc(100% - 90px)"}
              sx={{ display: "flex" }}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CircularProgress color="secondary" size={60} />
            </Box>
            {
            // Se extraen las variables globales
            obtenerHistorial()
            }
            {setLoading(false)}
          </>
        ) : (
        <Box display={'flex'} margin={'0 20px 0 20px'}>
          <TableContainer component={Paper} sx={ {maxHeight: '600px', border: '1px solid rgb(3,9,94)'}}>
            <Table aria-label='table' stickyHeader>
              <TableHead>
                <TableRow>
                  {
                    columns.map((column) => (
                      <TableCell align='center' 
                        key = {column.id}
                        sx={ { 
                                backgroundColor: 'rgb(3,4,94)', 
                                color:'rgb(228,228,228)', 
                                borderBottom: '1px solid rgb(3,9,94)',
                                fontFamily: 'Abel, sans-serif'
                              } 
                            }
                      >
                        {column.label}
                      </TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map( (row) => (
                    <TableRow key = {row.id}>
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.id}</TableCell>
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.servicio}</TableCell>
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.description}</TableCell>
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.aceptado}</TableCell>
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>
                        <Button variant='contained' onClick={() => handleClick(row)}>
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <TablePagination
              sx={{
                ".MuiTablePagination-toolbar": {
                  backgroundColor: "rgb(3,9,94)"
                },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                  color: 'white',
                  fontFamily: 'Abel, sans-serif'
                },
                ".MuiTablePagination-select, .MuiTablePagination-actions": {
                  fontFamily: 'Abel, sans-serif',
                  borderRadius: '5px',
                  backgroundColor: "white"
                }
              }}
              rowsPerPageOptions={[3, 7, 20]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      )}
    </>
  )
}

export default TableOrders;