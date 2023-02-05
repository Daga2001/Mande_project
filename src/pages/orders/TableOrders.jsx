import React from 'react';
import {Box, Table, TableBody, TableCell, TableHead, TableContainer, TablePagination,TableRow,Paper,Rating} from '@mui/material';
import * as utils from '../../utils/utils'
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { Co2Sharp } from '@mui/icons-material';
import { useNavigate, useLocation } from "react-router-dom";

const TableOrders = () => {
  const navigate = useNavigate()
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
  const [rating, setRating] = useState(0.0);  
  const [id,setId] = useState(0)
  const [descripcion,setDescripcion] = useState("")
  const [estado,setEstado] = useState("")
  const [datosServicio,setDatosServicio] = useState([])
  const [click,setClick] = useState(0)
  // Obtiene el historial del cliente

  async function obtenerHistorial() {
    console.log(window.localStorage.loginUser)
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

    let datosProcesados = []
    for (let i = 0; i < datos.length; i++) {
      datosProcesados.push({
        id: datos[i].service.sid,                                                                                                                                                                                                                                                                                                         
        servicio: datos[i].job,
        description: datos[i].service.description,
        estadoServicio: datos[i].service.status,
        calificacion: datos[i].service.rating,
      })
    }
    setData(datosProcesados)
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
        "sid":id
      })
    }
    console.log(id)
    fetch("http://127.0.0.1:8000/mande/service/view",config).then((res) => res.json()).then((res) => 
    {
      let datosProcesados = []
    for (let i = 0; i < res.length; i++) {
      datosProcesados.push({
        client_id: res[i].client.user_id,                                                                                                                                                                                                                                                                                                         
        worker_id: res[i].worker.user_id,
        jid: res[i].job.jid,
        card_num: res[i].card_num,
      })
    }
    setDatosServicio(datosProcesados)
    /*setDatosServicio(res.map(e =>(
      {
        "client_id":e.client.user_id,
        "worker_id":e.worker.user_id,
        "jid":e.job.jid,
        "card_num":e.card_num
      } )))*/
    })
  }

  const actualizarRatingServicio = async() => {
    console.log(rating)
    const config = {
      method: "PUT",
      headers: { 
        "Content-type": "application/json" ,
        Authorization: window.localStorage.loginUser
      },
      body: JSON.stringify(
        {
        'sid':id,
        'rating':rating,
        'status':estado,
        'description':descripcion,
        'client_id':datosServicio[0].client_id,
        'worker_id':datosServicio[0].worker_id,
        'jid':datosServicio[0].jid,
        'card_num':datosServicio[0].card_num
      })}
    console.log(config.body)
        const link = "http://127.0.0.1:8000/mande/service/info/update"
        fetch(link,config).then((res)=> res.json()).then((res)=>{console.log(res)})
    }

  const handleStars = (event,value) => {
    setRating(value)
    setId(event.id)
    setDescripcion(event.description)
    setEstado(event.estadoServicio)
    obtenerDatosServicio()
    actualizarRatingServicio()
    if(click == 1){
      navigate("../home")
    }
    else{
      setClick(click+1)
    }
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
                      <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}> <Rating name="promedioEstrellas" precision={0.1} value={+row.calificacion} onChange={(event, newValue) => handleStars(row, newValue)} /></TableCell>
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