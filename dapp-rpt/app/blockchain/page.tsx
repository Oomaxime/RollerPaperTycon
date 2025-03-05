"use client";

import { HETIC_ABI } from "@/public/hetic";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

/**
 * Adresse du contrat HETIC ERC20.
 * Cette adresse est utilisée pour interagir avec le contrat intelligent HETIC.
 */
const HETIC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Blockchain() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { address, isConnected } = useAccount();

  /**
   * Lecture du solde du contrat HETIC ERC20.
   * Cette lecture permet de récupérer le solde du contrat HETIC ERC20 pour l'adresse connectée.
   * @dev refetch permet de rafraîchir le solde du contrat HETIC ERC20.
   */
  const { data: balance, refetch } = useReadContract({
    abi: HETIC_ABI, // ABI du contrat HETIC ERC20
    functionName: "balanceOf", // Nom de la fonction à appeler
    address: HETIC_ADDRESS, // Adresse du contrat HETIC ERC20
    args: address ? [address] : undefined, // Only pass args if address exists
  });

  /**
   * Fonction pour créer des jetons HETIC ERC20.
   * Cette fonction permet de créer des jetons HETIC ERC20 pour l'adresse connectée.
   */
  const handleClick = () => {
    if (!address) return;
    writeContract({
      abi: HETIC_ABI, // ABI du contrat HETIC ERC20
      functionName: "mint", // Nom de la fonction à appeler
      address: HETIC_ADDRESS, // Adresse du contrat HETIC ERC20
      args: [address, 100n], // Argument pour la fonction mint
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-8xl font-bold mb-8 text-gray-800">
        Blockchain - Hetic
      </h1>
      <ConnectButton />
      {isConnected ? (
        <div className="flex gap-4 items-center justify-center">
          <p className="text-lg text-gray-500">
            Balance: {balance?.toString()}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mb-4"
          >
            Refresh
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-500">
          Connectez-vous avec votre wallet
        </p>
      )}
      {isConnected && (
        <button
          onClick={handleClick}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mb-4"
        >
          Mint
        </button>
      )}
      {isPending && <p className="text-yellow-500">Minting...</p>}
      {isSuccess && <p className="text-green-500">Minting successful!</p>}
      {isError && <p className="text-red-500">Minting failed.</p>}
    </div>
  );
}
