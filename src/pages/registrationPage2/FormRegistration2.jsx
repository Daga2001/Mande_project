import { Box, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage";
import "./formRegistration2.scss";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckList from "../../components/checkList/CheckList";
import SelectList from "../../components/selectList/SelectList";
import { useTranslation } from "react-i18next";

const FormRegistration2 = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [provideService, setProvideService] = useState(null);
  const [t, i18n] = useTranslation("registration");

  const submit = (values) => {
    console.log(values);
    navigate("/login");
  };

  return (
    <Grid item xs={12} sm={12} md={12} lg={7} xl={7}>
      <TopbarLandingPage />
      <Box
        height={isNonMobile ? "calc(100vh - 70px)" : "100%"}
        padding={"30px"}
      >
        <div className="registration2">
          <h1>{t("registration2.title")}</h1>
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
          {provideService === true ? (
            <Box paddingTop={"30px"}>
              <h3>
                {t("registration2.yes.sub-title")}
              </h3>
              <Box>
                <CheckList />
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
