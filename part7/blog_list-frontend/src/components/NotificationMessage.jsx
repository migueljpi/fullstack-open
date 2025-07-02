import "./NotificationMessage.css";
import { useNotificationValue } from "../contexts/NotificationContext";
import { Alert } from "react-bootstrap";

const NotificationMessage = () => {
  const notification = useNotificationValue();
  // console.log("NotificationMessage rendered with:", notification);
  const { message, type } = notification;
  if (!message) return null;

  const variant = type === "success" ? "success" : "danger";

  return (
    <Alert
      variant={variant}
      className="position-fixed m-3 shadow"
      style={{ zIndex: 10, minWidth: "300px", top: "70px", right: "85px" }}
    >
      {message}
    </Alert>
  );
};

export default NotificationMessage;
