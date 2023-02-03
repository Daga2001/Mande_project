import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useEffect } from "react";
import { ColorModeContext, tokens } from "../../style/theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  sidebarClasses,
  menuClasses,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "../react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";

const Topbar = () => {
  const context = useContext(Context);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { toggleSidebar, collapseSidebar, broken, rtl, collapsed } =
    useProSidebar();
  const navigate = useNavigate();

  function logout() {
    window.localStorage.removeItem("loginUser");
    navigate("/");
  }

  return (
    <Box
      display="flex"
      width={"100%"}
      height={"70px"}
      justifyContent={"space-between"}
      p={2}
    >
      <IconButton
        className="sb-button"
        onClick={() => {
          broken ? toggleSidebar() : collapseSidebar();
        }}
      >
        <MenuOutlinedIcon />
      </IconButton>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={logout}>
          <LogoutIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
