import React from "react";
import PropTypes from "prop-types";
import "../../scss/components/Clients/ClientListItem.scss";

export default function ClientListItem({ id, nom, prenom, email, telephone }) {
  function handleClick() {
    window.location.href = `/clients/${id}`;
  }

  return (
    <div className="clientCard">
      <div className="clientCard_value">
        <p className="clientCard_value_fullname">
          {prenom} {nom}
        </p>
        <div className="clientCard_value_infos">
          <p className="clientCard_value_infos_email">{email}</p>
          <p className="clientCard_value_infos_phone">{telephone}</p>
        </div>
      </div>

      <div className="clientCard_value_btns">
        <button type="button" className="clientCard_value_btns_email">
          <p className="icoEmail" /> Email
        </button>
        <button
          type="button"
          className="clientCard_value_btns_modifier"
          onClick={() => handleClick()}
        >
          Voir Plus
        </button>
      </div>
    </div>
  );
}

ClientListItem.propTypes = {
  id: PropTypes.number.isRequired,
  nom: PropTypes.string.isRequired,
  prenom: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  telephone: PropTypes.string.isRequired,
};
