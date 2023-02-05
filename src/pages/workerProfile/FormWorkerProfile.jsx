import { Box, Button, TextField, Typography, Rating} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
//import {  headerToken } from "../../data/headertoken";

const FormWorkerProfile = ( {type} ) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("registration");
  const [average, setAverage] = useState();
  const [info,setInfo] = useState([])
  const headerToken = {
    headers: {
      "Content-type": "application/json" ,
      Authorization: window.localStorage.loginUser
    },
  };
  const obtenerDatos=async () => {
    const config=headerToken;
    const link="http://127.0.0.1:8000/mande/user/view"
    const response= await fetch(link,config)
    const data = await response.json()
    setInfo(
      { f_name:data.user.f_name,
        l_name:data.user.l_name,
        uid:data.user.uid,
        birth_dt:data.user.birth_dt,
        address_id:data.user.address_id,
        email:data.user.email,
        password:data.user.password,
      })
    setAverage(data.avg_rating)
  }

  const guardarDatosUser = async () => {
    const config = {
      method: 'PUT',
      headers:headerToken.headers,
      body:JSON.stringify({
        "password":info.password,
        "uid":info.uid, 
        "f_name":info.f_name, 
        "l_name":info.l_name, 
        "birth_dt":info.birth_dt, 
        "email":info.email, 
        "address_id":info.address_id,
      })
    }
    const link="http://127.0.0.1:8000/mande/user/update"
    const response = await fetch(link,config)
    const data= await response.json();
    console.log("user_data_stored:",data)
  }

  const guardarContraseña= async (password) => {
    const config = {
      method: 'PUT',
      headers: headerToken.headers,
      body: JSON.stringify(
        {
          "password": password,
          "only_password": true,
        }
      )
    }
    const link="http://127.0.0.1:8000/mande/worker/update"
    const response = await fetch(link,config)
    const data = await response.json()
    console.log("password_change:",data)
  }

  useEffect(() => {
    obtenerDatos();
    console.log(headerToken)
  },[type]);

  const handleFormSubmit = (values) => {
    setInfo(
      {
        f_name:values.firstName,
        l_name:values.lastName,
        uid:values.idNumber,
        birth_dt:values.dateBirth,
        address_id:values.address,
        email:values.email,
        password: values.password
      }
    )
    console.log(info)
    guardarDatosUser()
    guardarContraseña(values.password)
  };
  
  

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required(t("registration1.error.require")),
    lastName: yup.string().required(t("registration1.error.require")),
    email: yup
      .string()
      .email(t("registration1.error.invalid-email"))
      .required(t("registration1.error.require")),
    address: yup.string().required(t("registration1.error.require")),
    password: yup
      .string()
      .required(t("registration1.error.require")),
      // .min(5, t("registration1.error.invalid-password")),
    idNumber: yup.string().required(t("registration1.error.require")),
  });

  const initialValues = {
    firstName: info.f_name,
    lastName: info.l_name,
    idNumber: info.uid,
    dateBirth: info.birth_dt,
    address: info.address_id,
    email: info.email,
    password: info.password,
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
      <Box
        height={isNonMobile ? "calc(100vh - 70px)" : "100%"}
        padding={"30px"}
      >
        <Formik
          enableReinitialize
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <Box>
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  height={"100%"}
                  gridTemplateColumns="repeat(6, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 6",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={t("registration1.first-name")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={t("registration1.last-name")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={t("registration1.id-number")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.idNumber}
                    name="idNumber"
                    error={!!touched.idNumber && !!errors.idNumber}
                    helperText={touched.idNumber && errors.idNumber}
                    disabled={true}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label={t("registration1.date-birth")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.dateBirth}
                    name="dateBirth"
                    error={!!touched.dateBirth && !!errors.dateBirth}
                    helperText={touched.dateBirth && errors.dateBirth}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={t("registration1.address")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    name="address"
                    error={!!touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                    sx={{ gridColumn: "span 6" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={t("registration1.email")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label={t("registration1.password")}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <Typography>
                    Calificación
                    <Rating value={+average} precision={0.1} readOnly size="large"/>
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="end" mt="20px">
                  <Button
                    type="submit"
                    sx={{ backgroundColor: "#03045e" }}
                    variant="contained"
                  >
                    {t("registration1.verify")}
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Formik>
      </Box>
    </Grid>
  );
};

export default FormWorkerProfile;
