import React from "react";
import { Box } from "@mui/material";
import WorkerSidebar from "../../components/sidebar/WorkerSidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import TableWorkerOrders from "./TableWorkerOrders";
import Restriccion from "../../components/restriccion/Restriccion";
import { useContext } from "react";
import { Context } from "../../context/Context";

const WorkerOrders = () => {
  const context = useContext(Context);
  return (
    <>
      {window.localStorage.loginUser === undefined ? (
        <Restriccion />
      ) : (
        <Box display={"flex"}>
          <Sidebar />
          <Box width={"100%"}>
            <Topbar />
            <Header title={"Pedidos"} subtitle={"Historial de Pedidos"} />
            <TableWorkerOrders />
          </Box>
        </Box>
      )}
    </>
  );
};

export default WorkerOrders;
