import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../style/theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb={"30px"} ml={"20px"} mr={"20px"}>
      <Typography
        variant="h2"
        color={colors.primary[500]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.accent1[500]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;