import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Faire défiler vers le haut
    window.scrollTo(0, 0);

    // Décocher tous les inputs de type checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const currentCheckbox = checkbox;
      currentCheckbox.checked = false;
    });
  }, [pathname]);

  return null;
}
