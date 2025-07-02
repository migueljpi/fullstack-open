import "./NotificationMessage.css";
import { useNotificationValue } from "../contexts/NotificationContext";
import { Alert } from "react-bootstrap";

const NotificationMessage = () => {
  const notification = useNotificationValue();
  // console.log("NotificationMessage rendered with:", notification);
  const { message, type } = notification;
  if (!message) return null;

  const variant = type === "success" ? "success" : "danger";

  return <Alert variant={variant}>{message}</Alert>;
};

export default NotificationMessage;
