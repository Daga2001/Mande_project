import { Box } from "@mui/material";
import WorkerSidebar from "../../components/sidebar/WorkerSidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";

const WorkerHome = () => {
  return (
    <Box display={"flex"}>
      <WorkerSidebar />
      <Box width={"100%"}>
        <Topbar />
        <Header title={"Home"} subtitle={"Esta es la página principal"}/>
      </Box>
    </Box>
  );
};

export default WorkerHome;
