import React from 'react';
import {
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableContainer, 
  TablePagination,
  TableRow,
  Paper} from '@mui/material';
import * as utils from '../../utils/utils'
import {  headerToken } from "../../data/headertoken";
import CircularProgress from "@mui/material/CircularProgress";

const TableOrders = () => {

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'servicio', label: 'Servicio Prestado', minWidth: 100 },
    { id: 'description', label: 'Comentarios del cliente', minWidth: 300 },
    { id: 'estadoServicio', label: 'Estado del Servicio', minWidth: 150 },
    { id: 'calificacion', label: 'Calificación', minWidth: 100 },
  ];
  
  function createData(id, servicio, estadoPago, estadoServicio, calificacion) {
    return {id, servicio, estadoPago, estadoServicio, calificacion};
  }

  // const mockdata = [
  //   createData(1, 'Cerrajero', 'Pagado', 'Terminado', '5'),
  //   createData(2, 'Plomero', 'No Pagado', 'En Progreso', ''),
  //   createData(3, 'Carpintero', 'Pagado', 'Terminado', '3'),
  //   createData(4, 'Carnicero', 'No Pagado', 'En Progreso', ''),
  //   createData(5, 'Arquero', 'Pagado', 'Terminado', '4'),
  // ];

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  
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
        estadoServicio: datos[i].service.status,
        calificacion: datos[i].service.rating,
      })
    }
    console.log("datos2:", datosProcesados)
    setData(datosProcesados)
  }
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
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
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.estadoServicio}</TableCell>
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.calificacion}</TableCell>
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