import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import ScrollToTop from "./ResetScrollOnPage";

import Navigation from "../components/NavigationBar";
import NavigationPhone from "../components/NavigationBarPhone";

import "../scss/contact.scss";

export default function Contact() {
  const [details, setDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  const isEmailValid = (value) => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$/;
    return emailPattern.test(value);
  };
  const isFirstnameValid = (value) => {
    const firstnamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\d\s'-]+$/;
    return firstnamePattern.test(value);
  };
  const isLastnameValid = (value) => {
    const lastnamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    return lastnamePattern.test(value);
  };
  const isSubjectValid = (value) => {
    const subjectPattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\d\s'-._]+$/;
    return subjectPattern.test(value);
  };
  const isMessageValid = (value) => {
    const messagePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\d\s'-._]+$/;
    return messagePattern.test(value);
  };
  const isCategoryValid = (value) => {
    const categoryPattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    return categoryPattern.test(value);
  };

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    if (!isEmailValid(details.email)) {
      document.getElementById("errorEmail").innerText =
        "Votre Email n'est pas valide";
      document.getElementById("email").classList.add("errorOnPlaceholder");
    } else {
      document.getElementById("errorEmail").innerText = "";
      document.getElementById("email").classList.remove("errorOnPlaceholder");
    }

    if (!isFirstnameValid(details.firstname)) {
      document.getElementById("errorFname").innerText =
        "Votre Prénom est requis";
      document.getElementById("firstname").classList.add("errorOnPlaceholder");
    } else {
      document.getElementById("errorFname").innerText = "";
      document
        .getElementById("firstname")
        .classList.remove("errorOnPlaceholder");
    }

    if (!isLastnameValid(details.lastname)) {
      document.getElementById("errorLname").innerText = "Votre Nom est requis";
      document.getElementById("lastname").classList.add("errorOnPlaceholder");
    } else {
      document.getElementById("errorLname").innerText = "";
      document
        .getElementById("lastname")
        .classList.remove("errorOnPlaceholder");
    }

    if (!isSubjectValid(details.subject)) {
      document.getElementById("errorSubject").innerText = "Un Sujet est requis";
      document.getElementById("subject").classList.add("errorOnPlaceholder");
    } else {
      document.getElementById("errorSubject").innerText = "";
      document.getElementById("subject").classList.remove("errorOnPlaceholder");
    }

    if (!isMessageValid(details.message)) {
      document.getElementById("errorMessage").innerText =
        "Un Message est requis";
      document.getElementById("message").classList.add("errorOnPlaceholder");
    } else {
      document.getElementById("errorMessage").innerText = "";
      document.getElementById("message").classList.remove("errorOnPlaceholder");
    }

    if (!isCategoryValid(details.category)) {
      document.getElementById("errorCategory").innerText =
        "Une categorie est requise";
      document
        .getElementById("category-selector")
        .classList.add("errorOnPlaceholder");
    } else {
      document.getElementById("errorCategory").innerText = "";
      document
        .getElementById("category-selector")
        .classList.remove("errorOnPlaceholder");
    }
    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  function escapeHtml(unsafe) {
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

  const handleSendEmail = () => {
    emailjs.init(import.meta.env.VITE_EMAIL_USER_ID);
    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        {
          firstname: escapeHtml(details.firstname),
          lastname: escapeHtml(details.lastname),
          category: escapeHtml(details.category),
          email: escapeHtml(details.email),
          subject: escapeHtml(details.subject),
          message: escapeHtml(details.message),
        }
      )
      .then((response) => {
        console.info(response);
        window.location = "/email-sent";
      })
      .catch((error) => {
        console.error(error);
        window.location = "/email-error";
      });
  };

  return (
    <main className="backgroundImageMain Contact_Container">
      <Navigation />
      <NavigationPhone />
      <ScrollToTop />
      <div className="contact_title">
        <h1>Contactez Nous</h1>
        <p className="contact_description">
          Vous avez une question, une suggestion ou une demande de partenariat ?
          <br />
          N'hésitez pas à nous contacter via le formulaire ci-dessous.
        </p>
      </div>
      <div className="from_contact_container">
        <div className="form_placeholder">
          <p className="form_placeholder_title">Nom</p>
          <input
            className="form_placeholder_input"
            name="lastname"
            id="lastname"
            value={details.lastname}
            onChange={handleDetailsChange}
            type="text"
            placeholder="Doe"
            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+,"
            required
          />
        </div>
        <div className="form_placeholder">
          <p className="form_placeholder_title">Prénom</p>
          <input
            className="form_placeholder_input"
            name="firstname"
            id="firstname"
            value={details.firstname}
            onChange={handleDetailsChange}
            type="text"
            placeholder="John"
            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+,"
            required
          />
        </div>
        <div className="form_placeholder">
          <p className="form_placeholder_title">Email</p>
          <input
            className="form_placeholder_input"
            name="email"
            id="email"
            value={details.email}
            onChange={handleDetailsChange}
            type="email"
            placeholder="john_doe@exemple.com"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,4}$"
            required
          />
        </div>
        <div className="form_placeholder">
          <label htmlFor="category-selector" className="form_placeholder_title">
            Catégorie
          </label>
          <select
            id="category-selector"
            className="form_placeholder_subject"
            name="category"
            onChange={handleDetailsChange}
            required
          >
            <option value="">-</option>
            <option value="Informations">Demande d'informations</option>
            <option value="Partenariat">Demande de partenariat</option>
            <option value="Assistance">Demande d'assistance</option>
            <option value="Autres">Autres</option>
          </select>
        </div>
        <div className="form_placeholder">
          <p className="form_placeholder_title">Sujet</p>
          <input
            className="form_placeholder_input"
            name="subject"
            id="subject"
            value={details.subject}
            onChange={handleDetailsChange}
            type="text"
            placeholder="Demande de ..."
            pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+,"
            required
          />
        </div>
        <div className="form_placeholder">
          <p className="form_placeholder_title">Message</p>
          <textarea
            className="form_placeholder_input form_placeholder_textarea"
            name="message"
            id="message"
            value={details.message}
            onChange={handleDetailsChange}
            type="text"
            placeholder="Votre message ici ..."
            required
          />
        </div>
        <button
          type="button"
          disabled={
            !details.firstname ||
            !details.lastname ||
            !details.subject ||
            !details.email ||
            !details.category ||
            !details.message
          }
          onClick={handleSendEmail}
          className="form_placeholder_button"
        >
          <span>Envoyer le Message</span>
        </button>
        <p className="error_container" id="errorLname" />
        <p className="error_container" id="errorFname" />
        <p className="error_container" id="errorCategory" />
        <p className="error_container" id="errorEmail" />
        <p className="error_container" id="errorSubject" />
        <p className="error_container" id="errorMessage" />
      </div>
    </main>
  );
}
