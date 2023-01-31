import Grid from "@mui/material/Grid"
import RegistrationImage from "../registration/RegistrationImage"
import FormRegistration2 from "./FormRegistration2"

const ResgistrationPage2 = () => {
  return (
    <Grid container>
      <FormRegistration2 />
      <RegistrationImage type={"page2"}/>
    </Grid>
  )
}

export default ResgistrationPage2