"use client";

import { RPT_ABI } from "@/public/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

/**
 * Adresse du contrat RPT ERC20.
 * Cette adresse est utilisée pour interagir avec le contrat intelligent RPT.
 */
const RPT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Blockchain() {
  const { writeContract} = useWriteContract();
  const { address, isConnected } = useAccount();

  /**
   * Lecture du solde du contrat RPT ERC20.
   * Cette lecture permet de récupérer le solde du contrat RPT ERC20 pour l'adresse connectée.
   * @dev refetch permet de rafraîchir le solde du contrat RPT ERC20.
   */
  const { data: balance, refetch } = useReadContract({
    abi: RPT_ABI, // ABI du contrat RPT ERC20
    functionName: "balanceOf", // Nom de la fonction à appeler
    address: RPT_ADDRESS, // Adresse du contrat RPT ERC20
    args: address ? [address] : undefined, // Only pass args if address exists
  });

  /**
   * Fonction pour créer des jetons RPT ERC20.
   * Cette fonction permet de créer des jetons RPT ERC20 pour l'adresse connectée.
   */
  const handleClick = () => {
    if (!address) return;
    writeContract({
      abi: RPT_ABI, // ABI du contrat RPT ERC20
      functionName: "mint", // Nom de la fonction à appeler
      address: RPT_ADDRESS, // Adresse du contrat RPT ERC20
      args: [address, 100000n], // Argument pour la fonction mint
    });
  };

  return (
    <>
    <div className="flex flex-col items-center place-content-between" style={{ height: "calc(100vh - 64px)" }}>
      <div className="mt-4 flex flex-col h-fit flex items-center place-content-between">
        <ConnectButton/>
        {isConnected ? (
          <div className="">
            <p>BONSOIR</p>
          </div>
        ) : (
          <div className="">
            <p className="text-lg text-gray-500">
              Connectez-vous avec votre wallet
            </p>
          </div>
        )}
      </div>
      {isConnected ? (
      <div className="">
        <p className="text-lg text-gray-500">
          Score :{balance?.toString()}
        </p>
      </div> 
      ) : (
        <div className="">
        </div>
        )}
      </div>
    </>
  );
}
