import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage";
import "./formRegistration.scss";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useContext } from "react";
import RegistrationPage2 from "../registrationPage2/ResgistrationPage2";
import { Context } from "../../context/Context";

const FormRegistration = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("registration");
  const [provideService, setProvideService] = useState(null);
  const [validar, setValidar] = useState(false);
  const context = useContext(Context);

  let imagenes = [];
  let idUser = null;
  let name = null;

  function crearUsuario(values) {
    let data = null;
    let direccion =
      (values.street != "" ? "Cra. " : "") +
      values.street +
      " " +
      (values.street2 != "" ? "Cl. " : "") +
      values.street2 +
      "# " +
      values.houseid +
      "-" +
      values.houseid2;
    name = values.firstName + " " + values.lastName;
    if (provideService === false) {
      data = {
        type: "Client",
        f_name: values.firstName,
        l_name: values.lastName,
        email: values.email,
        birth_dt: values.dateBirth,
        address_id: values.houseid,
        phone: values.contact,
      };
    } else {
      data = {
        type: "Worker",
        f_name: values.firstName,
        l_name: values.lastName,
        email: values.email,
        birth_dt: values.dateBirth,
        address_id: values.houseid,
        password: values.password,
        avg_rating: "0",
        available: true,
      };
    }
    fetch("http://127.0.0.1:8000/mande/user/create", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        idUser = res.uid;
        asignarUbicacion(res.uid, direccion);
      });
  }

  const handleFormSubmit = (values) => {
    let data = {
      house_id: values.houseid,
      street: values.street + " " + values.street2,
      city: values.ciudad,
      country: "Colombia",
      postal_code: "100006",
    };
    fetch("http://127.0.0.1:8000/mande/address/create", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        crearUsuario(values);
      });
  };

  function asignarUbicacion(id, direccion) {
    let hayCoordenadas = true;
    let lat = null;
    let lng = null;

    function enviar(latitud, longitud) {
      let data = {
        uid: id,
        latitude: latitud,
        longitude: longitud,
      };
      if (hayCoordenadas) {
        fetch("http://127.0.0.1:8000/mande/gpslocation/create", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            let data2 = {
              ...context.appState,
              registro: {
                id: idUser,
                trabajador: provideService,
              },
              name: name,
            };
            context.setAppState(data2);
            navigate("/registration/page2");
          });
      } else {
        console.log("no hay coordenadas");
      }
    }

    fetch(
      `http://api.positionstack.com/v1/forward?access_key=464691bbec21522ec36a86bcb168f7b4&country=CO&region=Cali&query= ${direccion}`
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        if (res.data.length === 0) {
          hayCoordenadas = false;
        } else {
          lat = res.data[0].latitude;
          lng = res.data[0].longitude;
        }
        // console.log(lat, lng);
        enviar(lat, lng);
      });
  }

  return (
    <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
      <TopbarLandingPage />
      <Box
        height={isNonMobile ? "calc(100vh - 70px)" : "100%"}
        padding={"30px"}
      >
        <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <div className="registration1">
              <h3>{t("registration1.title")}</h3>
              {provideService === null && <h1>{t("registration2.title")}</h1>}
              {provideService === null && (
                <Box
                  display={isNonMobile ? "grid" : "flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  gap="30px"
                  justifyItems={"center"}
                  gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 2",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      width: "230px",
                      borderRadius: "10px",
                      fontSize: "20px",
                      gridColumn: "span 1",
                    }}
                    onClick={() => {
                      setProvideService(true);
                    }}
                  >
                    {t("registration2.yes.title")}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      width: "230px",
                      borderRadius: "10px",
                      fontSize: "20px",
                      gridColumn: "span 1",
                    }}
                    onClick={() => {
                      setProvideService(false);
                    }}
                  >
                    {t("registration2.no.title")}
                  </Button>
                </Box>
              )}
              {provideService != null && (
                <form onSubmit={handleSubmit}>
                  <Box
                    display="grid"
                    gap="30px"
                    width={"100%"}
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
                      id="filled-number"
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
                      label={t("registration1.email")}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      sx={{ gridColumn: "span 6" }}
                    />
                    {provideService === false && (
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={t("registration1.number")}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.contact}
                        name="contact"
                        error={!!touched.contact && !!errors.contact}
                        helperText={touched.contact && errors.contact}
                        sx={{ gridColumn: "span 3" }}
                      />
                    )}
                    {provideService === true && (
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
                    )}
                    <h2 style={{ gridColumn: "span 6" }}>
                      Dirección de residencia
                    </h2>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label={"Carrera"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.street2}
                      name="street2"
                      error={!!touched.street2 && !!errors.street2}
                      helperText={touched.street2 && errors.street2}
                      sx={{ gridColumn: "span 3" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label={"Calle"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.street}
                      name="street"
                      error={!!touched.street && !!errors.street}
                      helperText={touched.street && errors.street}
                      sx={{ gridColumn: "span 3" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label={"#"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.houseid}
                      name="houseid"
                      error={!!touched.houseid && !!errors.houseid}
                      helperText={touched.houseid && errors.houseid}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label={"-"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.houseid2}
                      name="houseid2"
                      error={!!touched.houseid2 && !!errors.houseid2}
                      helperText={touched.houseid2 && errors.houseid2}
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label={"Ciudad"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ciudad}
                      name="ciudad"
                      error={!!touched.ciudad && !!errors.ciudad}
                      helperText={touched.ciudad && errors.ciudad}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </Box>
                  <Box
                    className="send"
                    paddingTop={"20px"}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Button
                      variant="outlined"
                      type="submit"
                      sx={{
                        width: "230px",
                        height: "50px",
                        borderRadius: "10px",
                      }}
                    >
                      Validar Datos
                    </Button>
                  </Box>
                </form>
              )}
            </div>
          )}
        </Formik>
      </Box>
    </Grid>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const initialValues = {
  firstName: "",
  lastName: "",
  dateBirth: "",
  street: "",
  street2: "",
  houseid: "",
  houseid2: "",
  ciudad: "",
  email: "",
  contact: "",
  password: "",
};

export default FormRegistration;
