import React from "react";
import PropTypes from "prop-types";
import "../../scss/components/GiftCard/GiftcardListItem.scss";

export default function GiftCardList({
  id,
  type,
  typeValue,
  montant,
  achat,
  expiration,
  utilise,
}) {
  function handleClick() {
    window.location.href = `/giftcards/${id}`;
  }
  const newformat = (date, format) => {
    const pad = (value) => (value < 10 ? `0${value}` : value);
    const map = {
      mm: pad(date.getMonth() + 1),
      dd: pad(date.getDate()),
      yyyy: date.getFullYear(),
    };

    return format.replace(/mm|dd|yyyy/gi, (matched) => map[matched]);
  };
  const date = new Date();
  const ExpirationFormated = newformat(new Date(expiration), "dd/mm/yyyy");
  const AchatFormated = newformat(new Date(achat), "dd/mm/yyyy");

  function RefId(value) {
    let ref;
    let prefix;
    if (type !== "Massage") {
      prefix = "CDF";
    } else {
      prefix = "CDM";
    }
    if (value < 100) {
      ref = `${prefix}-00${value}`;
    } else if (value < 10) {
      ref = `${prefix}-0${value}`;
    } else {
      ref = `${prefix}-${value}`;
    }
    return ref;
  }

  return (
    <div className="giftcard">
      <div className="giftcard_box">
        <div className="giftcard_box_infos">
          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">{type}</p>
            <p className="giftcard_box_infos_value_data">{typeValue}</p>
          </div>
          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Réference</p>
            <p className="giftcard_box_infos_value_data">{RefId(id)}</p>
          </div>
          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Montant</p>
            <p className="giftcard_box_infos_value_data">{`${montant} €`}</p>
          </div>
          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Date d'achat</p>
            <p className="giftcard_box_infos_value_data">{AchatFormated}</p>
          </div>

          {utilise ||
          newformat(new Date(expiration), "yyyymmdd") <=
            newformat(date, "yyyymmdd") ? (
            <div className="giftcard_box_infos_value">
              <p className="giftcard_box_infos_value_title">
                Date d'expiration
              </p>
              <p className="giftcard_box_infos_value_data">Expirée</p>
            </div>
          ) : (
            <div className="giftcard_box_infos_value">
              <p className="giftcard_box_infos_value_title">
                Date d'expiration
              </p>
              <p className="giftcard_box_infos_value_data">
                {ExpirationFormated}
              </p>
            </div>
          )}

          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Etat</p>
            <p className="giftcard_box_infos_value_data">
              {utilise ? "Utilisé" : "Non Utilisé"}
            </p>
          </div>
        </div>
      </div>

      <div className="giftcard_box_btns">
        {/* <button type="button" className="giftcard_box_btns_email">
          <p className="icoEmail" /> Email
          </button> */}
        <button
          type="button"
          className="giftcard_box_btns_modifier"
          onClick={() => handleClick()}
        >
          Voir Plus
        </button>
      </div>
    </div>
  );
}

GiftCardList.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  typeValue: PropTypes.string.isRequired,
  montant: PropTypes.string.isRequired,
  achat: PropTypes.string.isRequired,
  expiration: PropTypes.string.isRequired,
  utilise: PropTypes.number.isRequired,
};
