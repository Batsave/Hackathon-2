import React from "react";

import Navigation from "../components/NavigationBar";
import NavigationPhone from "../components/NavigationBarPhone";
import ScrollToTop from "./ResetScrollOnPage";

import UserInformation from "../components/Account/UserInformation";
import UserModification from "../components/Account/UserModification";

import "../scss/account.scss";

export default function Account() {
  return (
    <main id="MainContent">
      <ScrollToTop />
      <Navigation />
      <NavigationPhone />
      <UserInformation />
      <UserModification />
    </main>
  );
}
