import { Box } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";

const Orders = () => {
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
        <Header title={"Pedidos"} subtitle={"Historial de pedidos"} />
      </Box>
    </Box>
  );
};

export default Orders;
