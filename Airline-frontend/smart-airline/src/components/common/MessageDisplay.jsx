import React, { useState, useEffect } from "react";
import '../../css/messages-display.css';
const MessageDisplay = ({ message, type = "error", onDismiss }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = type === "error";
  const displayClass = isError ? "error-message" : "success-message";

  return (
    <div className={`message-display ${displayClass}`}>
      <div className="message-content">
        <span className="message-text">{message}</span>
        <div className="message-progress"></div>
      </div>
    </div>
  );
};

export const useMessage = () => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const showError = (message) => {
    setErrorMessage(message);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  const dismissSuccess = () => {
    setSuccessMessage(null);
  };

  return {

    ErrorDisplay: () => (
      <MessageDisplay
        message={errorMessage}
        type="error"
        onDismiss={dismissError}
      />
    ),

    SuccessDisplay: () => (
      <MessageDisplay
        message={successMessage}
        type="success"
        onDismiss={dismissSuccess}
      />
    ),

    showError,
    showSuccess,
    dismissError,
    dismissSuccess
  };
};

export default MessageDisplay;