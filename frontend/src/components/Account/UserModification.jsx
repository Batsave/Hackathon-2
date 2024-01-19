import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import mailError from "../../assets/LottieFiles/EmailError.json";

import AlertBox from "../alertBox/alertBox";

export default function UserModification() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stylist, setStylist] = useState(null);
  const [formData, setFormData] = useState({});
  const [StylistId, setStylistId] = useState("");

  // Alerte Box Configurations
  const [displayMode, setDisplayMode] = useState("none");
  const [AlertType, setAlertType] = useState("");
  const [AlerteEntete, setAlerteEntete] = useState("");
  const [AlertMessageSuccess, setAlertMessageSuccess] = useState("");
  const [AlertLink, setAlertLink] = useState("");

  useEffect(() => {
    const setData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/stylist/informations`,
          {
            withCredentials: true,
          }
        );

        await setStylist(response.data.Stylist[0]);
        await setFormData(response.data.Stylist[0]);
        await setStylistId(response.data.Stylist[0].stylistId);
        setIsLoggedIn(true);
      } catch (err) {
        console.warn(err);
        setIsLoggedIn(false);
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      }
      setIsLoading(false);
    };
    setData();
  }, []);

  function alertBox({ type, entete, message }) {
    setDisplayMode("flex");
    setAlertType(type);
    setAlerteEntete(entete);
    setAlertMessageSuccess(message);
    setTimeout(() => {
      setDisplayMode("none");
      setAlertType("");
      setAlerteEntete("");
      setAlertMessageSuccess("");
      setAlertLink("");
    }, 5400);
  }

  const isLastNameValid = (value) => {
    const lastNamePattern = /^[A-Za-z '-]{2,50}$/;
    return lastNamePattern.test(value);
  };
  const isFirstNameValid = (value) => {
    const firstNamePattern = /^[A-Za-z '-]{2,50}$/;
    return firstNamePattern.test(value);
  };
  const isRoleValid = (value) => {
    const roleValidPattern = /^[A-Za-z '-]{2,50}$/;
    return roleValidPattern.test(value);
  };
  const isOptinValid = (value) => {
    const optinValidPattern = /^[0-1]{1}$/;
    return optinValidPattern.test(value);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  function escapeHtml(unsafe) {
    if (unsafe === ("" || undefined || null)) {
      return "";
    }
    return unsafe.replace(/[&<"'>]/g, function toMatch(match) {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return match;
      }
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!isLastNameValid(formData.lastName)) {
        alertBox({
          type: "error",
          entete: "Modification",
          message: "LastName is not valid",
        });
      } else {
        setAlertType("");

        if (!isFirstNameValid(formData.firstName)) {
          alertBox({
            type: "error",
            entete: "Modification",
            message: "FirstName is not valid",
          });
        } else {
          setAlertType("");

          if (!isRoleValid(formData.stylistRole)) {
            alertBox({
              type: "error",
              entete: "Modification",
              message: "Role is not valid",
            });
          } else {
            setAlertType("");

            if (!isOptinValid(formData.optinValue)) {
              alertBox({
                type: "error",
                entete: "Modification",
                message: "Optin is not valid",
              });
            } else {
              const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/stylist/${StylistId}`,
                {
                  lastName: escapeHtml(formData.lastName),
                  firstName: escapeHtml(formData.firstName),
                  stylistRole: escapeHtml(formData.stylistRole),
                  optinValue: formData.optinValue,
                },
                { withCredentials: true }
              );
              alertBox({
                type: "success",
                entete: "Modification",
                message: "Modification is done",
                link: response.data.id,
              });
              console.info(response);
            }
          }
        }
      }
    } catch (error) {
      alertBox({
        type: "error",
        entete: "Modification",
        message: error.response?.data?.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <section>
        <div className="containererror">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Accès Impossible</h1>
          <p className="message">
            {`
          Vous n'êtes pas autorisé(e) à acceder a cette page.  `}
            <br /> {` Vous allez être redirigé(e) vers la page de connexion. `}
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="modification_container">
      <h2>Modification :</h2>
      {stylist && (
        <form onSubmit={handleSubmit}>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Role:
            <input
              type="text"
              name="stylistRole"
              value={formData.stylistRole || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Newsletter:
            <input
              type="checkbox"
              name="optinValue"
              checked={formData.optinValue || ""}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
      <AlertBox
        displayMode={displayMode}
        className="AlertBox"
        entete={AlerteEntete}
        type={AlertType}
        message={AlertMessageSuccess}
        link={AlertLink}
      />
    </div>
  );
}
