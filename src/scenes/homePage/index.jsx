import React from "react";
import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import { useSelector } from "react-redux";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import Popular from "../../components/Popular";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? "0rem" : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} isProfile={false} />
        </Box>

        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <FriendListWidget userId={_id} />
            <Popular />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
