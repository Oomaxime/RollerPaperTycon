// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = parseEther("0.001");

// Ce module utilise Hardhat Ignition pour gérer le déploiement du smart contrat Lock.
const LockModule = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  // Déploie le contrat "Lock" avec le paramètre 'unlockTime' pour le constructor
  const lock = m.contract("Lock", [unlockTime], {
    // Spécifie le nombre d'ether verrouillée 'lockedAmount' pour le contrat lors du déploiement
    value: lockedAmount,
  });

  return { lock };
});

export default LockModule;
