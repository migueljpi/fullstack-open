import "./NotificationMessage.css";
import { useNotificationValue } from "../contexts/NotificationContext";

const NotificationMessage = () => {
  const notification = useNotificationValue();
  // console.log("NotificationMessage rendered with:", notification);
  const { message, type } = notification;
  if (!message) return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default NotificationMessage;
