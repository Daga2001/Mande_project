import { Box } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Header from "../../components/header/Header";
import FormProfile from "./FormProfile";
import CardUser from "../../components/cardUser/CardUser";
import Grid from "@mui/material/Grid";

const Profile = () => {
  return (
    <Box display={"flex"}>
      <Sidebar />
      <Box width={"100%"}>
        <Topbar />
        <Header title={"Perfil"} subtitle={"Tu perfil"} />
        <Box height={"100%"} width={"100%"} display={"flex"}>
          <Grid>
            <FormProfile />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
