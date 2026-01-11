import { useEffect, useState } from "react";

function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // stop auto prompt
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    } else {
      console.log("User dismissed install");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return <button onClick={handleInstallClick}>📲 Download App</button>;
}

export default InstallPWAButton;
