import axiosInstance from "../../config/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  //   console.log(posts, "posts");

  const getPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      console.log(res, "res");

      dispatch(setPosts({ posts: res?.data?.posts }));
    } catch (err) {
      console.log(err, "error");
    }
  };

  const getUserPosts = async () => {
    try {
      const res = await axiosInstance.get(`/posts/${userId}`);
      dispatch(setPosts({ posts: res?.data?.posts }));
    } catch (err) {
      console.log(err, "error");
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);
  return (
    <>
      {posts?.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            _id={_id}
            userId={userId}
            firstName={firstName}
            lastName={lastName}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
