import { Box, Grid, Button } from "@mui/material"
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import ServicesList from "./ServicesList"

const ServicesProvided = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
          <ServicesList/>
      </Box>
    </Box>
  )
}

export default ServicesProvided