import { Box, Grid, Button } from "@mui/material"
import WorkerSidebar from "../../components/sidebar/WorkerSidebar";
import Topbar from "../../components/topbar/Topbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import ServiceDetails from "./ServiceDetails"

const WorkerService = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <Box display={"flex"}>
      <WorkerSidebar />
      <Box width={"100%"}>
        <Topbar />
          <ServiceDetails/>
      </Box>
    </Box>
  )
}
export default WorkerService