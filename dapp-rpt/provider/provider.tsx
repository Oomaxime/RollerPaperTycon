"use client";

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/configRainbowkit";

const queryClient = new QueryClient();

/**
 * Composant Provider pour l'application.
 * Cet élément encapsule les composants principaux de l'application :
 * - WagmiProvider : Fournisseur de contexte pour Wagmi (gestion des connexions blockchain)
 * - QueryClientProvider : Fournisseur de contexte pour React Query (gestion des requêtes)
 * - RainbowKitProvider : Fournisseur de contexte pour RainbowKit (gestion des connexions blockchain avec wallet)
 * - children : Composant enfant qui sera rendu dans le contexte (les pages de l'application)
 */
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme({
            accentColor: "#000000",
            borderRadius: "small",
            fontStack: "system",

            overlayBlur: "small",
          })}
          coolMode
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
