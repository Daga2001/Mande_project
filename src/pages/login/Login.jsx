import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormLogin from "./FormLogin";
import backg from "../../assets/login_xl.png";
import backg2 from "../../assets/login_xs.png";
import mande from "../../assets/mande.png";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage";

const Login = () => {
  return (
    <Grid container>
      
      <Grid item xs={0} sm={0} md={0} lg={6} xl={6}>
        <Box
          sx={{
            backgroundImage: `url(${backg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            height: "100%",
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${mande})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "100%",
            }}
          ></Box>
        </Box>
      </Grid>
      <FormLogin />
    </Grid>
  );
};

export default Login;
