"use client";
import { useState, useEffect } from "react";

// Define the interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallCheck() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if the app is running in standalone mode (installed as PWA)
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      setIsInstalled(isStandalone);
    };

    checkIsInstalled();

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkIsInstalled);

    // Capture the install prompt
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Add debug logging
      console.log("beforeinstallprompt event fired");
    });

    // Add debug code to check if PWA criteria are met
    console.log("PWA environment check:", {
      isHttps: window.location.protocol === "https:",
      hasServiceWorker: "serviceWorker" in navigator,
      isStandalone: window.matchMedia("(display-mode: standalone)").matches,
    });

    return () => {
      mediaQuery.removeEventListener("change", checkIsInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, so clear it
    setDeferredPrompt(null);
  };

  return (
    <div>
      {!isInstalled && deferredPrompt && (
        <button onClick={handleInstallClick} className="install-button">
          Install App
        </button>
      )}
    </div>
  );
}
