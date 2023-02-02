import { Box, Grid, Button } from "@mui/material"
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import ServiceDetails from "./ServiceDetails"

const ServiceRequest = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
          <ServiceDetails/>
      </Box>
    </Box>
  )
}
export default ServiceRequest