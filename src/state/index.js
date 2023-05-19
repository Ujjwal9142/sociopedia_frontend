import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  notification: {
    status: false,
    type: "",
    message: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends non-existant :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        } else {
          return post;
        }
      });
      state.posts = updatedPosts;
    },
    setNotification: (state, action) => {
      state.notification.message = action.payload.message;
      state.notification.status = action.payload.status;
      state.notification.type = action.payload.type;
    },
    clearNotification: (state) => {
      state.notification.message = "";
      state.notification.status = false;
      state.notification.type = null;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setMode,
  setPost,
  setPosts,
  setFriends,
  setNotification,
  clearNotification,
} = authSlice.actions;
export default authSlice.reducer;
