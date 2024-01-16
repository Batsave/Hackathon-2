import PropTypes from "prop-types";
import "../../scss/components/buttons.scss";
import { Link } from "react-router-dom";

export default function PrimaryButton({ btnText, btnLink }) {
  PrimaryButton.propTypes = {
    btnText: PropTypes.string.isRequired,
    btnLink: PropTypes.string.isRequired,
  };

  return (
    <Link className="primary-button" to={btnLink}>
      {btnText}
    </Link>
  );
}
