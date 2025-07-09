"use client";

import { Crisp } from "crisp-sdk-web";
import config from "@/config";
import { useTranslation } from "@/app/i18n/client";

// Use this button if chat is hidden on some routes. config.js has onlyShowOnRoutes set to ["/"] so it will be hidden on all routes except the home page.
// If Crisp is not enable, it will open the support email in the default email client.
const ButtonSupport = ({ lng }) => {
  const { t } = useTranslation(lng);
  const handleClick = () => {
    if (config.crisp?.id) {
      Crisp.chat.show();
      Crisp.chat.open();
    } else if (config.mailgun?.supportEmail) {
      // open default email client in new window with "need help with ${config.appName}" as subject
      window.open(
        `mailto:${config.mailgun.supportEmail}?subject=Need help with ${config.appName}`,
        "_blank"
      );
    }
  };

  return (
    <button
     className="link link-hover"
      onClick={handleClick}
 

    >
      {t('buttonSupport.support')}
    </button>
  );
};

export default ButtonSupport;
