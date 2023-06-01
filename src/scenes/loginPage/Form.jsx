import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setNotification } from "../../state/index";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import axiosInstance from "../../config/axiosInstance";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import "./Form.css";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Please enter your first name."),
  lastName: yup.string().required("Please enter your last name."),
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Please enter your Email Address."),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(5, "Password length is too short"),
  confirmPassword: yup
    .string()
    .required("Please re-enter your password.")
    .min(5, "Password length is too short"),
  location: yup.string().required("Please enter your location."),
  occupation: yup.string().required("Please enter your occupation."),
  picture: yup.string().required("A Profile picture is required."),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Please enter your Email Address."),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(5, "Password length is too short"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [picUrl, setPicUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const login = async (values, onSubmitProps) => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        const res = await axiosInstance.post("/auth/login", {
          email: values.email,
          password: values.password,
        });

        onSubmitProps.resetForm();
        if (res) {
          localStorage.setItem("token", res.data?.token);
          dispatch(setLogin({ user: res.data?.user, token: res.data?.token }));
          dispatch(
            setNotification({
              message: res.data?.message,
              status: true,
              type: "success",
            })
          );
          navigate("/home");
        }
        setIsLoading(false);
      } catch (err) {
        dispatch(
          setNotification({
            message: err?.response?.data?.message,
            status: true,
            type: "error",
          })
        );
        setIsLoading(false);
      }
    }
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
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          data
        );
        setPicUrl(res?.data?.secure_url?.toString());
      } else {
        dispatch(
          setNotification({
            status: true,
            message: "Only jpg, jpeg and png are allowed",
            type: "error",
          })
        );
      }
    } catch (err) {}
  };

  const register = async (values, onSubmitProps) => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post("/auth/register", {
          firstName: values.firstName,
          lastName: values.lastName,
          location: values.location,
          occupation: values.occupation,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          picturePath: picUrl,
          picture: values.picture,
        });

        onSubmitProps.resetForm();
        if (res) {
          setPageType("login");
          dispatch(
            setNotification({
              message: res.data?.message,
              status: true,
              type: "success",
            })
          );
        }
        setIsLoading(false);
      } catch (err) {
        dispatch(
          setNotification({
            message: err?.response?.data?.message,
            status: true,
            type: "error",
          })
        );
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) {
      await login(values, onSubmitProps);
    } else {
      await register(values, onSubmitProps);
    }
  };

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />

                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />

                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />

                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />

                  <Box
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                    gridColumn="span 4"
                  >
                    <Dropzone
                      multiple={false}
                      acceptedFiles=".jpg, .jpeg, .png"
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                        postPic(acceptedFiles[0]);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              {isRegister && (
                <TextField
                  label="Confirm Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={
                    Boolean(touched.confirmPassword) &&
                    Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  sx={{ gridColumn: "span 4" }}
                />
              )}
            </Box>

            {/* <div className="text-divider">
              <span>Or</span>
            </div> */}

            <Box>
              <Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0 1.5rem",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {isLoading ? (
                    <MoonLoader
                      color={"#000000"}
                      loading={isLoading}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : isLogin ? (
                    "LOGIN"
                  ) : (
                    "REGISTER"
                  )}
                </Button>
              </Box>
              {isLogin && (
                <Button
                  fullWidth
                  sx={{
                    m: "0 0 2rem",
                    p: "1rem",
                    backgroundColor: "darkred",
                    color: "white",
                  }}
                  onClick={() => {
                    setFieldValue("email", "anonymousguest@gmail.com");
                    setFieldValue("password", "onepiece");
                  }}
                >
                  USE GUEST CREDENTIALS
                </Button>
              )}
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                  m: `${isLoading ? "0 0 1rem" : "0"}`,
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>

              <Typography
                sx={{
                  color: "green",
                }}
              >
                {isLoading &&
                  "Please be patient for the initial LOGIN/SIGNUP (Since everything is deployed on free tier 😅), thanks for your understanding!"}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Form;
