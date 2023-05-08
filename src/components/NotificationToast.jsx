import { Alert } from "@mui/material";
import SnackBar from "@mui/material/Snackbar";
import { clearNotification } from "../state/index";
import { useDispatch, useSelector } from "react-redux";

const NotificationToast = ({ verticalPosition, horizontalPosition }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.notification.status);
  const type = useSelector((state) => state.notification.type);
  const message = useSelector((state) => state.notification.message);
  return (
    <div>
      <SnackBar
        anchorOrigin={{
          vertical: verticalPosition,
          horizontal: horizontalPosition,
        }}
        open={open}
        onClose={() => dispatch(clearNotification())}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => dispatch(clearNotification())}
          severity={type}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </SnackBar>
    </div>
  );
};

export default NotificationToast;
