import { Box, Grid, Button } from "@mui/material"
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import ServiceInfo from "./ServiceInfo"

const ServiceInformation = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
          <ServiceInfo/>
      </Box>
    </Box>
  )
}

export default ServiceInformation