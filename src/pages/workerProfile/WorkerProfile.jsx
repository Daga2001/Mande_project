import { Box } from "@mui/material";
import WorkerSidebar from "../../components/sidebar/WorkerSidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import FormWorkerProfile from "./FormWorkerProfile";
import CardUser from "../../components/cardUser/CardUser";
import Grid from "@mui/material/Grid";
import Restriccion from "../../components/restriccion/Restriccion";
import { useContext } from "react";
import { Context } from "../../context/Context";

const WorkerProfile = () => {
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
            <Header title={"Perfil"} subtitle={"Tu perfil"} />
            <Box height={"100%"} width={"100%"} display={"flex"}>
              <Grid>
                <FormWorkerProfile />
              </Grid>
              <Grid>
                <CardUser />
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default WorkerProfile;
