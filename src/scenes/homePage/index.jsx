import React from "react";
import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import UserWidget from "../widgets/UserWidget";
import { useSelector } from "react-redux";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  return (
    <Box>
      <Navbar />
      <Box>
        <Box>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
