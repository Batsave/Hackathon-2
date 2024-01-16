import "../../scss/auth/SuccessAuth.scss";
import Lottie from "react-lottie-player";
import LogInProgress from "../../assets/LottieFiles/LogIn.json";
import ScrollToTop from "../ResetScrollOnPage";

export default function SuccessLogIn() {
  setTimeout(() => {
    window.location.href = "/admin";
  }, 3800);
  return (
    <div className="SuccessLogIn">
      <div className="SuccessLogIn_container">
        <ScrollToTop />
        <div className="containererror">
          <Lottie
            loop
            animationData={LogInProgress}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Connexion en cours</h1>
        </div>
      </div>
    </div>
  );
}
