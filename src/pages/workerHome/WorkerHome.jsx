import { Box } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";

const WorkerHome = () => {
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
        <Header title={"Home"} subtitle={"Esta es la página principal"}/>
      </Box>
    </Box>
  );
};

export default WorkerHome;
