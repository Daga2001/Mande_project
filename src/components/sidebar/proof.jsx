import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../style/theme";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
  menuClasses,
} from "../react-pro-sidebar";
import m from "../../assets/m2.png";
import mande from "../../assets/mande3.png";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HandshakeIcon from "@mui/icons-material/Handshake";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import { useNavigate } from "react-router-dom";

let Theme = 'light' | 'dark';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

const SidebarE = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Sidebar
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        breakPoint="lg"
        backgroundColor={colors.primary[500]}
        rootStyles={{
          color: `${colors.secondary[500]}`,
          backgroundColor: "red"
        }}
      >
        <Box
          height={"60px"}
          width={"100%"}
          display={"flex"}
          justifyContent={"space-around"}
        >
          <img src={m} alt="logo" />
          <img src={mande} alt="nombre" />
        </Box>
        <br />
        <Menu>
          <MenuItem icon={<HomeIcon />}>Home</MenuItem>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarE;
