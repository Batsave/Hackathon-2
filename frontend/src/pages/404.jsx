import "../scss/pages.scss";
import Lottie from "react-lottie-player";
import animation404 from "../assets/LottieFiles/404-animation.json";
import PrimaryButton from "../components/buttons/PrimaryButton";
import ScrollToTop from "./ResetScrollOnPage";

export default function NotFound() {
  return (
    <section>
      <ScrollToTop />
      <div className="containererror">
        <Lottie
          loop
          animationData={animation404}
          play
          style={{ width: 260, height: 150 }}
        />
        <h1>You're worth it, but it seems the page doesn't exist.</h1>
        <p className="message">We advise you to return to the home page.</p>
        <PrimaryButton btnText="Return to home page" btnLink="/" />
      </div>
    </section>
  );
}
