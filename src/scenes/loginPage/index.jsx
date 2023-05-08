import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Form from "./Form";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (token && user) {
      navigate("/home");
    }
  }, []);
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        p="1rem 6%"
        width="100%"
        textAlign="center"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="bold" color="primary" fontSize="32px">
          Sociopedia
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography sx={{ mb: "1.5rem" }} variant="h5" fontWeight="500">
          Welcome to Sociopedia, the Social Media for Sociopaths.
        </Typography>

        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
