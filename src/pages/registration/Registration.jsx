import Grid from "@mui/material/Grid";
import RegistrationImage from "./RegistrationImage";
import FormRegistration from "./FormRegistration";

const Registration = () => {
  return (
    <Grid container>
      <RegistrationImage type={"page1"}/>
      <FormRegistration />
    </Grid>
  );
};

export default Registration;
