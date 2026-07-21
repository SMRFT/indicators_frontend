import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-theme.css";

const DateField = ({ placeholderText = "Select Date", className = "", ...rest }) => (
  <div className="date-field">
    <FontAwesomeIcon icon={faCalendarAlt} className="date-field-icon" />
    <DatePicker
      placeholderText={placeholderText}
      className={`form-control date-field-input ${className}`}
      {...rest}
    />
  </div>
);

export default DateField;
