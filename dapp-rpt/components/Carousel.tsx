import { RPT_ABI } from "@/public/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";

const RPT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const STORE_ADDRESS = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

interface Skin {
  id: number;
  isBought: boolean;
  isUsed: boolean;
  price: number;
  image: string;
}

const defaultSkins: Skin[] = [
  { id: 0, isBought: false, isUsed: false, price: 100, image: "/skins/skin1.png" },
  { id: 1, isBought: false, isUsed: false, price: 250, image: "/skins/skin2.png" },
  { id: 2, isBought: false, isUsed: false, price: 500, image: "/skins/skin3.png" },
  { id: 3, isBought: false, isUsed: false, price: 1000, image: "/skins/skin4.png" },
  { id: 4, isBought: false, isUsed: false, price: 2000, image: "/skins/skin5.png" },
];

export default function Blockchain() {
  const [skins, setSkins] = useState<Skin[]>(defaultSkins);
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string | null }>({});
  // On stocke l'ID du skin pour lequel la transaction est en cours
  const [currentTxSkinId, setCurrentTxSkinId] = useState<number | null>(null);

  const { address, isConnected } = useAccount();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSkins = localStorage.getItem("skins");
      if (savedSkins) {
        setSkins(JSON.parse(savedSkins));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("skins", JSON.stringify(skins));
    }
  }, [skins]);

  // Surveille isSuccess/isError pour le skin en cours
  useEffect(() => {
    if (currentTxSkinId !== null) {
      if (isSuccess) {
        setSkins((prev) =>
          prev.map((skin) =>
            skin.id === currentTxSkinId ? { ...skin, isBought: true } : skin
          )
        );
        setErrorMessages((prev) => ({ ...prev, [currentTxSkinId]: "Achat effectué !" }));
        const skinIdToClear = currentTxSkinId;
        setTimeout(() => {
          setErrorMessages((prev) => ({ ...prev, [skinIdToClear]: null }));
        }, 5000);
        setCurrentTxSkinId(null);
      } else if (isError) {
        // En cas d'erreur, on s'assure que le skin reste non acheté
        setSkins((prev) =>
          prev.map((skin) =>
            skin.id === currentTxSkinId ? { ...skin, isBought: false } : skin
          )
        );
        setErrorMessages((prev) => ({ ...prev, [currentTxSkinId]: "Achat annulé." }));
        const skinIdToClear = currentTxSkinId;
        setTimeout(() => {
          setErrorMessages((prev) => ({ ...prev, [skinIdToClear]: null }));
        }, 5000);
        setCurrentTxSkinId(null);
      }
    }
  }, [isSuccess, isError, currentTxSkinId]);

  const buySkin = (skinId: number) => {
    const selectedSkin = skins.find((skin) => skin.id === skinId);
    if (!selectedSkin) {
      console.error("Skin non trouvé");
      return;
    }
    if (selectedSkin.price === undefined) {
      console.error("Le prix du skin n'est pas défini.");
      return;
    }
    if (!address) {
      console.error("Utilisateur non connecté");
      return;
    }

    // On enregistre l'ID du skin en cours et on lance l'achat
    setCurrentTxSkinId(skinId);
    writeContract({
      abi: RPT_ABI,
      functionName: "transfer",
      address: STORE_ADDRESS,
      args: [RPT_ADDRESS, BigInt(selectedSkin.price)],
    });
  };

  const useSkin = (skinId: number) => {
    setSkins((prev) =>
      prev.map((skin) => ({
        ...skin,
        isUsed: skin.id === skinId,
      }))
    );
  };

  return (
    <div className="flex flex-col p-8" style={{ height: "calc(100vh - 64px)" }}>
      {isConnected ? (
        <div>
          <h1 className="text-center">
            Aller aux toilettes, c&apos;est bien...{" "}
            <b>Mais le faire avec style, c&apos;est encore mieux !😎</b> Choisissez parmi nos nombreux skins de papiers toilettes pour avoir la classe, même sur le trône! 🧻
          </h1>
          <br />
          <hr />
          <div>
            <Carousel opts={{ align: "start" }} className="w-full max-w-sm">
              <CarouselContent>
                {skins.map((skin) => (
                  <CarouselItem key={skin.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 h-60">
                          <Image src={skin.image} alt={`Skin ${skin.id + 1}`} height={200} width={100} className="object-cover" />
                        </CardContent>
                      </Card>
                      {skin.isBought ? (
                        skin.isUsed ? (
                          <Button className="mt-4 w-[300px]" disabled>
                            En cours d&apos;utilisation
                          </Button>
                        ) : (
                          <Button className="mt-4 w-[300px]" onClick={() => useSkin(skin.id)}>
                            Utiliser le skin ?
                          </Button>
                        )
                      ) : (
                        <Button className="mt-4 w-[300px]" onClick={() => buySkin(skin.id)}>
                          Acheter {skin.price} NFT
                        </Button>
                      )}
                      {/* Affiche "Achat en cours..." uniquement pour le skin concerné */}
                      {currentTxSkinId === skin.id && isPending && (
                        <p className="text-yellow-500">Achat en cours...</p>
                      )}
                      {errorMessages[skin.id] && (
                        <p className="mt-2 text-center text-sm">{errorMessages[skin.id]}</p>
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
            Tout le monde a besoin de papier toilette, même les non-connectés! Connectez-vous pour avoir accès à notre collection de papiers toilettes! 🧻
          </p>
          <ConnectButton />
        </div>
      )}
    </div>
  );
}