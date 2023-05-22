import { Box, Typography, useTheme } from "@mui/material";
import Friend from "./Friend";
import WidgetWrapper from "./WidgetWrapper";
import axiosInstance from "../config/axiosInstance";
import { useEffect, useState } from "react";

const Popular = () => {
  const { palette } = useTheme();
  const [popularUsers, setPopularUsers] = useState([]);

  const fetchPopular = async () => {
    try {
      const res = await axiosInstance.get("/users/popular");
      setPopularUsers(res?.data?.users);
    } catch (err) {}
  };

  useEffect(() => {
    fetchPopular();
  }, []);

  return (
    <WidgetWrapper sx={{ mt: "2rem" }}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Popular on Sociopedia
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {popularUsers.map((user) => (
          <Friend
            friendId={user._id}
            key={user._id}
            name={`${user.firstName} ${user.lastName}`}
            userPicturePath={user.picturePath}
            subtitle={user.occupation}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default Popular;
