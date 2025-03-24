import React from "react";
import CookieConsent from "react-cookie-consent";

const CookieConsentComponent: React.FC = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I accept"
      cookieName="myAwesomeCookieConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
};

export default CookieConsentComponent;