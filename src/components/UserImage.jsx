import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box height={size} width={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        height={size}
        width={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
