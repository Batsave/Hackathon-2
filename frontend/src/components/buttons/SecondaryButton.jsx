import "../../scss/components/buttons.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function SecondaryButton({ btnText, btnLink }) {
  SecondaryButton.propTypes = {
    btnText: PropTypes.string.isRequired,
    btnLink: PropTypes.string.isRequired,
  };

  return (
    <Link className="secondary-button" to={btnLink}>
      {btnText}
    </Link>
  );
}
