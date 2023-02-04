import { Box, Grid, Button } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import ServicesList from "./ServicesList";
import Restriccion from "../../components/restriccion/Restriccion";
import { useContext } from "react";
import { Context } from "../../context/Context";

const ServicesProvided = () => {
  const context = useContext(Context);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <>
      {window.localStorage.loginUser === undefined ? (
        <Restriccion />
      ) : (
        <Box display={"flex"}>
          <Sidebar />
          <Box width={"100%"}>
            <Topbar />
            <ServicesList />
          </Box>
        </Box>
      )}
    </>
  );
};

export default ServicesProvided;
