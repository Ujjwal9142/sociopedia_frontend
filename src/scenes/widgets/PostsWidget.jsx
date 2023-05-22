import axiosInstance from "../../config/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  const getPosts = async () => {
    try {
      const res = await axiosInstance.get("/posts");
      dispatch(setPosts({ posts: res?.data?.posts }));
    } catch (err) {}
  };

  const getUserPosts = async () => {
    try {
      const res = await axiosInstance.get(`/posts/${userId}`);
      dispatch(setPosts({ posts: res?.data?.posts }));
    } catch (err) {}
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
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            isProfile={isProfile}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
