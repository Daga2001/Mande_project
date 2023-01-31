import { Box } from "@mui/material";
import backg from "../../assets/registro.png";
import backg2 from "../../assets/registro2.png";
import m from "../../assets/m.png";
import Grid from "@mui/material/Grid";

const RegistrationImage = ({type}) => {
  let background = null;
  if(type === "page1") {
    background = backg;
  } else {
    background = backg2
  }

  return (
    <Grid item xs={0} sm={0} md={0} lg={5} xl={5}>
      <Box
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          height: "100%",
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${m})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "50% 70%",
            height: "100%",
          }}
        ></Box>
      </Box>
    </Grid>
  );
};

export default RegistrationImage;
