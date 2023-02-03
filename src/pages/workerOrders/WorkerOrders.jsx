import React from 'react'
import { Box } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import TableWorkerOrders from "./TableWorkerOrders";

const WorkerOrders = () => {
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
        <Header title={"Pedidos"} subtitle={"Historial de Pedidos"}/>
        <TableWorkerOrders/>
      </Box>
    </Box>
  )
}

export default WorkerOrders