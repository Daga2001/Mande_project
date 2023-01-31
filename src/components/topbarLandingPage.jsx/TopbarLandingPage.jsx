import { Box, IconButton, Button, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../style/theme";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useState } from "react";
import { findRelativeConfig } from "@babel/core/lib/config/files";
import m from "../../assets/m2.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./topBarLandingpage.scss"

const TopbarLandingPage = () => {
  const [modeTheme, setModeTheme] = useState("light");
  const [t, i18n] = useTranslation("topbarLandingPage");
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      width={"100%"}
      height={"70px"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      backgroundColor={"transparent"}
      sx={{
        boxShadow: "0px 5px 0px 0px rgba(0,0,0,0.1)",
        position: "relative",
        paddingLeft: "10px",
        paddingRight: "10px",
        zIndex: "100",
      }}
    >
      <Box>
        <img className="image" width={"60px"} src={m} alt="logo" onClick={() => {navigate("/")}}/>
      </Box>
      <Box width={"280px"} display={"flex"} justifyContent={"space-between"}>
        <Button
          variant="outlined"
          sx={{
            fontSize: "10px",
            backgroundColor: "rgba(3,4,94,1)",
            color: "rgba(0,180,216,1)",
            transition: "all 0.5s"
          }}
          onClick={() => {navigate("/login")}}
        >
          {t("log_in")}
        </Button>
        <Button
          variant="outlined"
          sx={{
            fontSize: "10px",
            backgroundColor: "rgba(3,4,94,1)",
            color: "rgba(0,180,216,1)",
            transition: "all 0.5s"
          }}
          onClick={() => {navigate("/registration/page1")}}
        >
          {t("sign_up")}
        </Button>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          onClick={() => {
            i18n.language === "es"
              ? i18n.changeLanguage("en")
              : i18n.changeLanguage("es");
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopbarLandingPage;
