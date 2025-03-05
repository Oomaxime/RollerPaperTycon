// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Ce module utilise Hardhat Ignition pour gérer le déploiement du smart contrat RollerPaperTycoon.
const rptModule = buildModule("rptModule", (m) => {
  // Déploiement du smart contrat RollerPaperTycoon
  const rpt = m.contract("RollerPaperTycoon");

  return { rpt };
});

export default rptModule;
