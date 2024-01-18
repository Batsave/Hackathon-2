import React from "react";
import PropTypes from "prop-types";

export default function GiftCardList({
  id,
  type,
  typeValue,
  nbSeance,
  nbSeanceRestante,
  achat,
  expiration,
}) {
  function handleClick() {
    window.location.href = `/clients/${id}`;
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
    if (value < 100) {
      ref = `GC-00${value}`;
    } else if (value < 10) {
      ref = `GC-0${value}`;
    } else {
      ref = `GC-${value}`;
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
            <p className="giftcard_box_infos_value_title">Restants</p>
            <p className="giftcard_box_infos_value_data">{`${nbSeanceRestante} / ${nbSeance}`}</p>
          </div>
          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Date d'achat</p>
            <p className="giftcard_box_infos_value_data">{AchatFormated}</p>
          </div>

          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Date d'expiration</p>
            <p className="giftcard_box_infos_value_data">
              {newformat(new Date(expiration), "yyyymmdd") <=
              newformat(date, "yyyymmdd")
                ? "Expiré"
                : ExpirationFormated}
            </p>
            S
          </div>

          <div className="giftcard_box_infos_value">
            <p className="giftcard_box_infos_value_title">Etat</p>
            <p className="giftcard_box_infos_value_data">
              {nbSeanceRestante <= 0 ? "Epuisé" : "En Cours"}
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
  nbSeance: PropTypes.number.isRequired,
  achat: PropTypes.string.isRequired,
  expiration: PropTypes.string.isRequired,
  nbSeanceRestante: PropTypes.number.isRequired,
};
