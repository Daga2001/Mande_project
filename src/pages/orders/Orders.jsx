import { Box } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import TableOrders from "./TableOrders";
import Restriccion from "../../components/restriccion/Restriccion";
import { useContext } from "react";
import { Context } from "../../context/Context";

const Orders = () => {
  const context = useContext(Context);
  console.log(context)
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
            <TableOrders />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Orders;
