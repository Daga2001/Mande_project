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

const TableOrders = () => {

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'servicio', label: 'Servicio Prestado', minWidth: 100 },
    { id: 'estadoPago', label: 'Estado de Pago', minWidth: 100 },
    { id: 'estadoServicio', label: 'Estado del Servicio', minWidth: 150 },
    { id: 'calificacion', label: 'Calificación', minWidth: 100 },
  ];
  
  function createData(id, servicio, estadoPago, estadoServicio, calificacion) {
    return {id, servicio, estadoPago, estadoServicio, calificacion};
  }

  const data = [
    createData(1, 'Cerrajero', 'Pagado', 'Terminado', '5'),
    createData(2, 'Plomero', 'No Pagado', 'En Progreso', ''),
    createData(3, 'Carpintero', 'Pagado', 'Terminado', '3'),
    createData(4, 'Carnicero', 'No Pagado', 'En Progreso', ''),
    createData(5, 'Arquero', 'Pagado', 'Terminado', '4'),
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
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
                  <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.estadoPago}</TableCell>
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
  )
}

export default TableOrders;