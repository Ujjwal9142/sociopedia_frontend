import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setNotification, setPosts } from "../../state/index";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import axios from "axios";
import crypto from "crypto";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState({ url: null, public_id: null });

  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const medium = palette.neutral.medium;
  const mediumMain = palette.neutral.mediumMain;

  const generateSHA1 = (data) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
  };

  const generateSignature = (publicId) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${
      import.meta.env.VITE_APP_API_SECRET
    }`;
  };

  const postPic = async (pic) => {
    try {
      if (pic === undefined) {
        dispatch(
          setNotification({
            status: true,
            message: "Please select an image",
            type: "error",
          })
        );
        return;
      }

      if (
        pic.type === "image/jpeg" ||
        pic.type === "image/jpg" ||
        pic.type === "image/png"
      ) {
        const data = new FormData();
        data.append("file", pic);
        data.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_POST_PRESET
        );
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          data
        );
        setImageData({
          url: res?.data?.secure_url?.toString(),
          public_id: res?.data?.public_id,
        });
      } else {
        dispatch(
          setNotification({
            status: true,
            message: "Only jpg, jpeg and png are allowed",
            type: "error",
          })
        );
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  const deletePic = async () => {
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/destroy`,
        {
          public_id: imageData.public_id,
          api_key: import.meta.env.VITE_APP_API_KEY,
          signature: generateSHA1(generateSignature(imageData.public_id)),
        }
      );
      console.log(res, "del");
      setImageData({ url: null, public_id: null });
    } catch (err) {
      console.log(err, "error");
    }
  };

  // const handlePost = async () => {
  //   try {
  //     SocioPosts
  //     // const response = await axiosInstance.post('https://localhost:3001/posts/create', {
  //     //   userId:
  //     // });
  //   } catch (err) {
  //     dispatch(
  //       setNotification({
  //         status: true,
  //         message: "Some error occured, please try again later",
  //         type: "error",
  //       })
  //     );
  //   }
  // };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            multiple={false}
            acceptedFiles=".jpg, .jpeg, .png"
            onDrop={(acceptedFiles) => {
              postPic(acceptedFiles[0]);
              setImage(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                  width="100%"
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => {
                      deletePic();
                      setImage(null);
                    }}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0rem" }} />

      <FlexBetween>
        <FlexBetween onClick={() => setIsImage(!isImage)} gap="0.25rem">
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
