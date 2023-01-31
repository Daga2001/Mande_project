import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../style/theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import m from "../../assets/m2.png";
import mande from "../../assets/mande3.png";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HandshakeIcon from "@mui/icons-material/Handshake";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.secondary[500],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      height={"100vh"}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.accent4[600]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.secondary[700]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.secondary[700]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          {!isCollapsed ? (
            <Box
              height={"50px"}
              width={"100%"}
              display={"flex"}
              justifyContent={"space-evenly"}
            >
              <img src={m} alt="logo" />
              <img src={mande} alt="nombre" />
            </Box>
          ) : (
            <Box
              height={"40px"}
              width={"100%"}
              display={"flex"}
              justifyContent={"space-around"}
            >
              <img src={m} alt="logo" />
            </Box>
          )}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed && <MenuOutlinedIcon />}
            style={{
              margin: "10px 0 20px 0",
              color: colors.secondary[500],
            }}
          ></MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={colors.secondary[700]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Menu
            </Typography>
            <Item
              title="Home"
              to="/client/home"
              icon={<HomeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Perfil"
              to="/client/profile"
              icon={<AccountBoxIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Servicios"
              to="/client/services"
              icon={<HandshakeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pedidos"
              to="/client/orders"
              icon={<KeyboardCommandKeyIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
