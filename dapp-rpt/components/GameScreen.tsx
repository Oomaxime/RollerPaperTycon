"use client";

import { RPT_ABI } from "@/data/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import React from "react";

// ER20 RPT contract address
const RPT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Ajout d'un tableau de skins disponibles à l'achat
const AVAILABLE_SKINS = [
  { id: 1, name: "Skin Basique", price: 1000n, image: "/skins/basic.png" },
  { id: 2, name: "Skin Premium", price: 5000n, image: "/skins/premium.png" },
  {
    id: 3,
    name: "Skin Légendaire",
    price: 8000n,
    image: "/skins/legendary.png",
  },
];

export default function GameScreen() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { address, isConnected } = useAccount();
  // État pour suivre les skins achetés par l'utilisateur
  const [ownedSkins, setOwnedSkins] = React.useState<number[]>([]);
  // État pour les messages de transaction
  const [transactionStatus, setTransactionStatus] = React.useState("");

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
  const handleMintClick = () => {
    if (!address) return;
    writeContract(
      {
        abi: RPT_ABI, // ABI du contrat RPT ERC20
        functionName: "mint", // Nom de la fonction à appeler
        address: RPT_ADDRESS, // Adresse du contrat RPT ERC20
        args: [address, 10000n], // Argument pour la fonction mint
      },
      {
        onSuccess: () => {
          // Rafraîchir le solde après confirmation de la transaction
          refetch();
          setTransactionStatus("Mint réussi !");
        },
        onError: () => {
          setTransactionStatus("Le mint a échoué.");
        },
      }
    );
  };

  /**
   * Fonction pour acheter un skin avec des tokens RPT
   * @param skinId L'ID du skin à acheter
   * @param price Le prix du skin en tokens RPT
   */
  const handleBuySkin = (skinId: number, price: bigint) => {
    if (!address) return;

    // Vérifier si l'utilisateur a suffisamment de tokens
    if (balance && balance < price) {
      setTransactionStatus("Solde insuffisant pour acheter ce skin");
      return;
    }

    // Appeler la fonction transfer du contrat RPT pour envoyer les tokens au contrat (ou à une adresse spécifique)
    // Ici, nous envoyons les tokens à l'adresse du contrat lui-même, mais vous pourriez les envoyer à une autre adresse
    writeContract(
      {
        abi: RPT_ABI,
        functionName: "transfer",
        address: RPT_ADDRESS,
        args: [RPT_ADDRESS, price], // Envoyer les tokens au contrat lui-même
      },
      {
        onSuccess: () => {
          // Ajouter le skin à la liste des skins possédés
          setOwnedSkins([...ownedSkins, skinId]);
          setTransactionStatus("Achat réussi !");
          // Rafraîchir le solde
          refetch();
        },
        onError: () => {
          setTransactionStatus("L'achat a échoué.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <h1 className="text-base font-bold mb-8 text-gray-800">
        Blockchain - RollerPaperTycoon
      </h1>
      <ConnectButton />
      {isConnected ? (
        <div className="flex flex-col items-center">
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
            <button
              onClick={handleMintClick}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mb-4 w-[300px]"
            >
              Mint
            </button>
          </div>

          {/* Affichage des skins disponibles à l'achat */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Boutique de Skins</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AVAILABLE_SKINS.map((skin) => (
                <div
                  key={skin.id}
                  className="border rounded-lg p-4 flex flex-col items-center"
                >
                  <div className="w-32 h-32 bg-gray-200 mb-2 rounded-md flex items-center justify-center">
                    {/* Remplacer par une vraie image quand disponible */}
                    <span>Image du skin</span>
                  </div>
                  <h3 className="font-bold">{skin.name}</h3>
                  <p className="text-gray-600">{skin.price.toString()} RPT</p>
                  <button
                    onClick={() => handleBuySkin(skin.id, skin.price)}
                    disabled={ownedSkins.includes(skin.id)}
                    className={`mt-2 px-4 py-1 rounded-full ${
                      ownedSkins.includes(skin.id)
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {ownedSkins.includes(skin.id) ? "Possédé" : "Acheter"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Affichage du statut de la transaction */}
          {transactionStatus && (
            <p
              className={`mt-4 ${
                transactionStatus.includes("réussi")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {transactionStatus}
            </p>
          )}
        </div>
      ) : (
        <p className="text-lg text-gray-500">
          Connectez-vous avec votre wallet
        </p>
      )}
      {isPending && <p className="text-yellow-500">Transaction en cours...</p>}
      {isSuccess && <p className="text-green-500">Transaction réussie !</p>}
      {isError && <p className="text-red-500">La transaction a échoué.</p>}
    </div>
  );
}
