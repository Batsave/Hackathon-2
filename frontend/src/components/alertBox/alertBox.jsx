import "../../scss/components/AlertBox/AlertBox.scss";

export default function alertBox({ type, entete, message, displayMode }) {
  switch (type) {
    case "success":
      return (
        <div
          className="alert_boxtype alert_boxtype_success"
          style={{ display: displayMode }}
          role="alert"
        >
          <p className="alert_boxtype_success_heading"> {entete}</p>
          <p className="alert_boxtype_success_message">{message}</p>
          <hr className="alert_boxtype_success_time" />
        </div>
      );
    case "error":
      return (
        <div
          className="alert_boxtype alert_boxtype_error"
          style={{ display: displayMode }}
          role="alert"
        >
          <p className="alert_boxtype_error_heading"> {entete}</p>
          <p className="alert_boxtype_error_message">{message}</p>
          <hr className="alert_boxtype_error_time" />
        </div>
      );
    case "warning":
      return (
        <div
          className="alert_boxtype alert_boxtype_warning"
          style={{ display: displayMode }}
          role="alert"
        >
          <p className="alert_boxtype_warning_heading"> {entete}</p>
          <p className="alert_boxtype_warning_message">{message}</p>
          <hr className="alert_boxtype_warning_time" />
        </div>
      );
    default:
      return null;
  }
}
