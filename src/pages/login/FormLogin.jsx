import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import "./formLogin.scss";
import logo from "../../assets/m2.png";
import { useTranslation } from "react-i18next";
import TopbarLandingPage from "../../components/topbarLandingPage.jsx/TopbarLandingPage";
import { useNavigate } from "react-router-dom";
import { WifiTetheringErrorRoundedTwoTone } from "@mui/icons-material";
import { useContext } from "react";
import { Context } from "../../context/Context";

const FormLogin = () => {
  const [t, i18n] = useTranslation("login");
  const navigate = useNavigate();
  const context = useContext(Context);

  // Creating schema
  let schema = Yup.object().shape({
    email: Yup.string()
      .required(t("error.require-email"))
      .email(t("error.invalid-email")),
    password: Yup.string().required(t("error.require-password")),
    // .min(5, t("error.min-password")),
  });

  function handleFormSubmit(values) {
    console.log("enviando");
    let data = {
      email: values.email,
      password: values.password,
      phone: values.password,
    };
    let config = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    }
    console.log("user_data:",data);
    console.log("config login:", config)
    fetch("http://127.0.0.1:8000/mande/user/login", config)
      .then((res) => res.json())
      .then((res) => {
        window.localStorage.setItem(
          "loginUser",
          "Token " + res.description.token
        );
        context.setAppState({
          ...context.appState,
          roll: res.description.user,
        });
        if (window.localStorage.loginUser != undefined) {
          navigate(
            `/${res.description.user === "Client" ? "client" : "worker"}/home`
          );
        }
      });
  }

  return (
    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
      <TopbarLandingPage />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 70px)",
        }}
      >
        <Formik
          validationSchema={schema}
          initialValues={{ email: "", password: "" }}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <div className="login">
              <form noValidate onSubmit={handleSubmit}>
                <div className="image">
                  <img src={logo} alt="logo" />
                </div>
                <h3>{t("title")}</h3>
                <h5>{t("subtitle")}</h5>
                <div className="inputs">
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    placeholder={t("placeholder-email")}
                    className="form-control inp_text"
                    id="email"
                  />
                  <p className="error email">
                    {errors.email && touched.email && errors.email}
                  </p>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder={t("placeholder-password")}
                    className="form-control"
                  />
                  <p className="error pass">
                    {errors.password && touched.password && errors.password}
                  </p>
                  <p className="forget">
                    {t("forgot-password")}{" "}
                    <a href="#" className="text-blue-500">
                      {t("recover-password")}
                    </a>
                  </p>
                </div>
                <button type="submit">{t("logIn")}</button>
                <p className="forget">
                  {t("account")}{" "}
                  <a href="#" className="text-blue-500">
                    {t("signUp")}
                  </a>
                </p>
              </form>
            </div>
          )}
        </Formik>
      </Box>
    </Grid>
  );
};

export default FormLogin;
