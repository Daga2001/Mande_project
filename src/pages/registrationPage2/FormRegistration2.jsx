import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage";
import "./formRegistration2.scss";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import CheckList from "../../components/checkList/CheckList";
import SelectList from "../../components/selectList/SelectList";
import { useTranslation } from "react-i18next";
import { Context } from "../../context/Context";
import PaymentForm from "../../components/paymentForm/PaymentForm";

const FormRegistration2 = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [t, i18n] = useTranslation("registration");
  const context = useContext(Context);

  let provideService = context.appState.registro.trabajador;
  let id = context.appState.registro.id;

  let imagenes = [];

  const submit = (values) => {
    navigate("/login");
  };

  function onImageChange(input) {
    let images = input.target.files;
    if (provideService === false) {
      imagenes = [];
      imagenes.push(images[0]);
    }
    if (provideService === true) {
      if (imagenes.length === 0) {
        imagenes.push(images[0]);
      } else {
        imagenes.push(images[0]);
      }
    }
    const body = new FormData();
    if (provideService === true && imagenes.length === 2) {
      body.append("idc_img_data", imagenes[0], imagenes[0].idc);
      body.append("prof_img_data", imagenes[1], imagenes[1].prof);
      body.append("uid", id);
      cargarImagenes(body);
    } else if (provideService === false) {
      body.append("receipt_data", imagenes[0], imagenes[0].receipt);
      body.append("uid", id);
      cargarImagenes(body);
    }
  }

  function cargarImagenes(cuerpo) {
    let config = {
      method: "POST",
      headers: {},
      body: cuerpo,
    };
    fetch("http://127.0.0.1:8000/mande/images/upload", config).then((res) =>
      res.json()
    );
  }

  return (
    <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
      <TopbarLandingPage />
      <Box
        height={isNonMobile ? "calc(100vh - 70px)" : "100%"}
        width={"100%"}
        padding={"30px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <div className="registration2">
          <h1>Registro</h1>
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

          {provideService === true ? (
            <Box paddingTop={"30px"}>
              <h3>{t("registration2.yes.sub-title")}</h3>
              <Box>
                <CheckList />
                <PaymentForm />
              </Box>
            </Box>
          ) : (
            provideService != null && (
              <Box paddingTop={"30px"}>
                <h3>{t("registration2.no.sub-title")}</h3>
                <SelectList />
                <Box padding={"10px"}>
                  <h4>{t("registration2.no.message")}</h4>
                </Box>
              </Box>
            )
          )}
          {(provideService === true || provideService === false) && (
            <Box className="send">
              <Button
                variant="outlined"
                sx={{
                  width: "230px",
                  height: "50px",
                  borderRadius: "10px",
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                {t("registration2.sign-up")}
              </Button>
            </Box>
          )}
        </div>
      </Box>
    </Grid>
  );
};

export default FormRegistration2;
