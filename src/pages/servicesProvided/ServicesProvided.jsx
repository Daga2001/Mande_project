import { Box } from "@mui/material"
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";

const ServicesProvided = () => {
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
        <Header title={"Servicios"} subtitle={"Servicios de la app"}/>
      </Box>
    </Box>
  )
}

export default ServicesProvided