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
import { useState } from "react";
import { asignarUbicacion } from "../../services/ubicacion";

const FormRegistration = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("registration");
  const [provideService, setProvideService] = useState(null);

  let imagenes = [];

  // const initialValues = {
  //   firstName: "",
  //   lastName: "",
  //   dateBirth: "",
  //   street: "",
  //   street2: "",
  //   houseid: "",
  //   ciudad: "",
  //   email: "",
  //   contact: "",
  //   password: "",
  // };

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
        // console.log(res);
        // console.log(res.uid)
        asignarUbicacion(res.uid, direccion);
        //asignarimagen(fetch("/subirImagen/"))
      });
    // .then((res) => navigate("/login"));
  }

  const handleFormSubmit = (values) => {
    // console.log(values);
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
        // console.log("Direccion enviada");
        crearUsuario(values);
      });
    // navigate("/login");
  };

  function onImageChange(input) {
    let images = input.target.files;
    // console.log("OnImageChange");
    // console.log("Provider", provideService);
    // console.log("Numero de imágenes", imagenes.length);
    if (provideService === false) {
      // console.log("Provider flase");
      imagenes = [];
      imagenes.push(images[0]);
      // console.log("Imagen cargada");
    }
    if (provideService === true) {
      // console.log("Provider true");
      if (imagenes.length === 0) {
        imagenes.push(images[0]);
        // console.log("Imagen 1 cargada");
      } else {
        imagenes.push(images[0]);
        // console.log("Imagen 2 cargada");
      }
    }
    // if (images.length > 0) {
    //   for (let i = 0; i < images.length; i++) {
    //     imagenes.push(images[i]);
    //     console.log("Imagen cargada");
    //   }
    // }
    // console.log("Numero de imágenes 2:", imagenes.length);
    const body = new FormData();
    if (provideService === true && imagenes.length === 2) {
      body.append("idc_img_data", imagenes[0], imagenes[0].idc);
      body.append("prof_img_data", imagenes[1], imagenes[1].prof);
      body.append("uid", 1);
      cargarImagenes(body);
    } else if (provideService === false){
      body.append("receipt_data", imagenes[0], imagenes[0].receipt);
      body.append("uid", 3);
      cargarImagenes(body);
    }
  }

  function cargarImagenes(cuerpo) {
    let config = {
      method: "POST",
      headers: {},
      body: cuerpo,
    };
    fetch("http://127.0.0.1:8000/mande/images/upload", config)
      .then((res) => res.json())
      // .then((res) => console.log("Imagen guardada"));
  }

  const checkoutSchema = yup.object().shape({
    // firstName: yup.string().required(t("registration1.error.require")),
    // lastName: yup.string().required(t("registration1.error.require")),
    // email: yup
    //   .string()
    //   .email(t("registration1.error.invalid-email"))
    //   .required(t("registration1.error.require")),
    // contact: yup
    //   .string()
    //   // .matches(phoneRegExp, "Phone number is not valid")
    //   .required(t("registration1.error.require")),
    // // street: yup.string().required("Requerido"),
    // ciudad: yup.string().required("Requerido"),
    // houseid: yup.string().required("Requerido"),
    // password: yup
    //   .string()
    //   .required(t("registration1.error.require"))
    //   .min(5, t("registration1.error.invalid-password")),
    // idNumber: yup.string().required(t("registration1.error.require")),
  });

  return (
    <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
      <TopbarLandingPage />
      <Box
        height={isNonMobile ? "calc(100vh - 70px)" : "100%"}
        padding={"30px"}
      >
        <Formik
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
                    {/* <TextField
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
                      sx={{ gridColumn: "span 3" }}
                    /> */}
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
                    {provideService === true && (
                      <Button
                        variant="contained"
                        component="label"
                        endIcon={<PhotoCamera />}
                        sx={{ gridColumn: "span 2" }}
                      >
                        {t("registration1.profile-photo")}
                        <input type="file" hidden onChange={onImageChange} />
                      </Button>
                    )}
                    {provideService === true && (
                      <Button
                        variant="contained"
                        component="label"
                        endIcon={<PhotoCamera />}
                        sx={{ gridColumn: "span 2" }}
                      >
                        {t("registration1.id-photo")}
                        <input type="file" hidden onChange={onImageChange} />
                      </Button>
                    )}
                    {provideService === false && (
                      <Button
                        variant="contained"
                        component="label"
                        endIcon={<PhotoCamera />}
                        sx={{ gridColumn: "span 2" }}
                      >
                        {t("registration1.bill-photo")}
                        <input type="file" hidden onChange={onImageChange} />
                      </Button>
                    )}
                  </Box>
                  <Box
                    className="send"
                    paddingTop={"20px"}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Button
                      variant="outlined"
                      type="submitZ"
                      sx={{
                        width: "230px",
                        height: "50px",
                        borderRadius: "10px",
                      }}
                    >
                      {t("registration2.sign-up")}
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
