import { Box } from "@mui/material";
import WorkerSidebar from "../../components/sidebar/WorkerSidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import Restriccion from "../../components/restriccion/Restriccion";
import { useContext } from "react";
import { Context } from "../../context/Context";

const WorkerHome = () => {
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
            <Header title={"Home"} subtitle={"Esta es la página principal"} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default WorkerHome;
