import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setNotification } from "../../state/index";
import axiosInstance from "../../config/axiosInstance";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setUser(response?.data?.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    viewedProfile,
    impressions,
    occupation,
    location,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* First Row */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color="dark"
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >{`${firstName} ${lastName}`}</Typography>
            <Typography
              color={medium}
            >{`${friends?.length} friends`}</Typography>
          </Box>
          <ManageAccountsOutlined />
        </FlexBetween>
        <Divider />

        {/* Second Row */}
        <Box p="1rem 0rem">
          <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
            <LocationOnOutlined />
            <Typography color={medium}>{location}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="1rem">
            <WorkOutlineOutlined />
            <Typography color={medium}>{occupation}</Typography>
          </Box>
        </Box>

        {/* Third row */}
        <Box p="1rem 0">
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Who's viewed your Profile</Typography>
            <Typography color={main} fontweight="500">
              {viewedProfile}
            </Typography>
          </FlexBetween>

          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography color={main} fontweight="500">
              {impressions}
            </Typography>
          </FlexBetween>
        </Box>

        {/* Fourth row */}
        <Box p="1rem 0">
          <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
            Social Profiles
          </Typography>
          <FlexBetween gap="1rem" mb="0.5rem">
            <FlexBetween gap="1rem">
              <img src="../assts.twitter.png" alt="twitter" />
              <Box>
                <Typography color={main} fontweight="500">
                  Twitter
                </Typography>
              </Box>
            </FlexBetween>
          </FlexBetween>
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default UserWidget;
