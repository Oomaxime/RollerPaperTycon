import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat } from "wagmi/chains";

/**
 * Configuration pour la librairie RainbowKit.
 * Cette configuration définit les paramètres de l'application, y compris le nom de l'application,
 */
export const config = getDefaultConfig({
  appName: "Dapp RollerPaperTycoon",
  projectId: "YOUR_PROJECT_ID",
  chains: [hardhat], // Chaîne de test (la blockchain que vous avez en local)
  ssr: true, // Si votre dApp utilise le rendu côté serveur (SSR)
});
