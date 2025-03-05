// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Ce module utilise Hardhat Ignition pour gérer le déploiement du smart contrat Hetic.
const heticModule = buildModule("heticModule", (m) => {
  // Déploiement du smart contrat Hetic
  const hetic = m.contract("Hetic");

  return { hetic };
});

export default heticModule;
