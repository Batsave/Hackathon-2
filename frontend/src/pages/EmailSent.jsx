import "../scss/pages.scss";
import Lottie from "react-lottie-player";
import mailSent from "../assets/LottieFiles/MailSend.json";
import PrimaryButton from "../components/buttons/PrimaryButton";
import ScrollToTop from "./ResetScrollOnPage";

export default function EmailSent() {
  return (
    <section>
      <ScrollToTop />
      <div className="containererror">
        <Lottie
          loop
          animationData={mailSent}
          play
          style={{ width: 120, height: 120 }}
        />
        <h1>Your message has been successfully transmitted</h1>
        <p className="message">We will get back to you as soon as possible.</p>
        <PrimaryButton btnText="retourner à la page d'accueil" btnLink="/" />
      </div>
    </section>
  );
}
