import RedCircleIcon from "./icon/red-circle-icon";
import { Alert } from "@mantine/core";
import { FC } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const defaultErrorMessage = "Communication with the server has failed. Please try again later.";

export type ErrorMessage = {
  show: boolean;
  title?: string;
  message?: string;
  severity?: "error" | "warning";
};
const Notification: FC<{ error: ErrorMessage; onClose: () => void }> = (props) => {
  const { error } = props;

  return (
    <Alert
      icon={
        props.error.severity ? (
          error.severity === "error" ? (
            <RedCircleIcon />
          ) : (
            <FaExclamationTriangle />
          )
        ) : (
          <RedCircleIcon />
        )
      }
      title={error.title ? error.title : "Communication Error"}
      color={error.severity ? (error.severity === "error" ? "red" : "blue") : "red"}
      withCloseButton
      onClose={props.onClose}
    >
      {error.message ? error.message : defaultErrorMessage}
    </Alert>
  );
};

export default Notification;
