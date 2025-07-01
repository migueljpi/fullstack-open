import "./NotificationMessage.css";

const NotificationMessage = ({ message, type }) => {
  if (!message) return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default NotificationMessage;
