"use client";

import { RPT_ABI } from "@/public/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { use, useState } from "react";

/**
 * Adresse du contrat RPT ERC20.
 * Cette adresse est utilisée pour interagir avec le contrat intelligent RPT.
 */
const RPT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Blockchain() {
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { address, isConnected } = useAccount();

  const [isBought, setIsBought] = useState(true);
  const [isUsed, setIsUsed] = useState(false);

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

  const useSkin = () => {
    setIsUsed(true);
  }

  return (
    <div className="flex flex-col p-8" style={{ height: "calc(100vh - 64px)" }}>
      {isConnected ? (
        <div>
          <h1 className="text-center">
            Aller aux toilettes, c'est bien... <b>Mais le faire avec style, c'est encore mieux !😎</b> Choisissez parmi nos nombreux 
            skins de papiers toilettes pour avoir la classe, même sur le trône! 🧻 
          </h1>
          <br/>
          <hr/>
            <div className="flex gap-4 items-center justify-center">
              <p className="text-lg text-gray-500">
                Solde actuel: {balance?.toString()}
              </p>
            </div>
          <div>
            <Carousel
              opts={{align: "start"}}
              className="w-full max-w-sm"
            >
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 h-60">
                          <span className="text-3xl font-semibold">{index + 1}</span>
                        </CardContent>
                      </Card>
                      {isBought ? (
                        isUsed ? (
                          <div>
                            <button
                              className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors mb-4 w-[300px]"
                            >
                              En cours d'utilisation 
                            </button>
                        </div>
                          ) : (
                        
                          <div>
                            <button
                              onClick={useSkin}
                              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-100 transition-colors mb-4 w-[300px]"
                            >
                              Utiliser le skin ?
                            </button>
                        </div>
                        )
                      ) : (
                        <div>
                          <button
                            onClick={handleClick}
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mb-4 w-[300px]"
                          >
                            Acheter
                          </button>
                          {isPending && <p className="text-yellow-500">Achat en cours...</p>}
                          {isSuccess && <p className="text-green-500">Achat effectué !</p>}
                          {isError && <p className="text-red-500">Achat annulé.</p>}
                        </div>
                      )}
                      
                    </div>
                    </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        ) : (
          <div>
            <p className="text-lg text-center text-gray-500">
              Tout le monde a besoin de papier toilette, même les non-connectés! 
              Connectez-vous pour avoir accès à notre collection de papiers toilettes! 🧻 
            </p>
            <ConnectButton/>
          </div>
        )
      }
    </div>
  );
}
