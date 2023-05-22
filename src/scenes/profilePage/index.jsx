import { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import axiosInstance from "../../config/axiosInstance";
import { setNotification } from "../../state/index";

const ProfilePage = () => {
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`users/${userId}`);
      setUser(res?.data?.user);
    } catch (err) {
      dispatch(
        setNotification({
          status: true,
          message: "User information not found, please try again later.",
          type: "error",
        })
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return null;
  }
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} isProfile={true} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? "0rem" : "2rem"}
        >
          <PostsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
