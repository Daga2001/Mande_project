import React from 'react';
import {
  Box,
  Button, 
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
    { id: 'aceptado', label: '¿Aceptado?', minWidth: 100 },
    { id: 'terminado', label: '¿Terminado?', minWidth: 100 },
    { id: 'accion', label: 'Acción', minWidth: 75 },
  ];
  
  function createData(id, servicio, estadoPago, aceptado, terminado, accion) {
    return {id, servicio, estadoPago, aceptado, terminado, accion};
  }

  const data = [
    createData(1, 'Cerrajero', 'Pagado', 'Sí', 'Sí', 'Ver'),
    createData(2, 'Plomero', 'No Pagado', 'No', '-', 'Ver'),
    createData(3, 'Carpintero', 'Pagado', 'Si', 'Sí', 'Ver'),
    createData(4, 'Carnicero', 'No Pagado', 'No', '-', 'Ver'),
    createData(5, 'Arquero', 'Pagado', 'Sí', 'Sí', 'Ver'),
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
                  <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.aceptado}</TableCell>
                  <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>{row.terminado}</TableCell>
                  <TableCell align='center' sx={{border: '1px solid rgb(3,9,94)', fontFamily: 'Abel, sans-serif'}}>
                    <Button variant='contained' type='submit'>
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
  )
}

export default TableOrders;