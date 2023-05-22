import axiosInstance from "../../config/axiosInstance";
import WidgetWrapper from "../../components/WidgetWrapper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";

const FriendListWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const friends = useSelector((state) => state.user.friends);

  const fetchFriends = async () => {
    try {
      const res = await axiosInstance.get(`users/${userId}/friends`);
      dispatch(setFriends({ friends: res?.data?.friends }));
    } catch (err) {}
  };

  useEffect(() => {
    fetchFriends();
  }, []);
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              friendId={friend._id}
              key={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              userPicturePath={friend.picturePath}
              subtitle={friend.occupation}
              isProfile={isProfile}
            />
          ))
        ) : (
          <Typography color={medium} fontSize="0.8rem" sx={{ mb: "0.5rem" }}>
            No friends yet!
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
