import { RPT_ABI } from "@/public/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, GalleryHorizontal } from "lucide-react";

const RPT_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const STORE_ADDRESS = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

export default function Blockchain() {
  interface Skin {
    id: number;
    isBought: boolean;
    isUsed: boolean;
    price: number;
  }

  const defaultSkins: Skin[] = [
    { id: 0, isBought: false, isUsed: false, price: 100 },
    { id: 1, isBought: false, isUsed: false, price: 250 },
    { id: 2, isBought: false, isUsed: false, price: 500 },
    { id: 3, isBought: false, isUsed: false, price: 1000 },
    { id: 4, isBought: false, isUsed: false, price: 2000 },
  ];

  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { address, isConnected } = useAccount();

  // Initialisation des skins à partir du localStorage ou avec les valeurs par défaut
  const [skins, setSkins] = useState<Skin[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skins");
      return saved ? JSON.parse(saved) : defaultSkins;
    }
    return defaultSkins;
  });

  // Message d'état pour chaque skin
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string | null }>({});
  // ID du skin dont la transaction est en cours
  const [currentTxSkinId, setCurrentTxSkinId] = useState<number | null>(null);

  // Sauvegarde des skins dans le localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("skins", JSON.stringify(skins));
    }
  }, [skins]);

  // Surveille le résultat de la transaction et met à jour l'état du skin concerné
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
    if (!address) {
      console.error("Utilisateur non connecté");
      return;
    }
    // Enregistrer l'ID du skin en cours et lancer la transaction
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
    )
    localStorage.setItem("skin_color", JSON.stringify(skinId))
  };

  return (
    <div className="min-h-screen flex flex-col justify-center gap-4 p-8" style={{ height: "calc(100vh - 64px)" }}>
      {isConnected ? (
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <h1 className="text-center">
            Aller aux toilettes, c'est bien... <b>Mais le faire avec style, c'est encore mieux !😎</b> 
            Choisissez parmi nos nombreux skins de papiers toilettes pour avoir la classe, même sur le trône! 🧻
          </h1>

          <div className="absolute top-2 right-2 p-4">
            <ConnectButton accountStatus="avatar" chainStatus="none" />
          </div>

          <Link href={`/`} className="absolute top-2 left-2 p-4">
            <Button className="cursor-pointer">
              <ArrowLeft />
            </Button>
          </Link>

          <div className="flex justify-center items-center gap-4 mt-4">
            <GalleryHorizontal />
          </div>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {skins.map((skin) => (
                <CarouselItem key={skin.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-0">
                    <Card className="p-0">
                      <CardContent className="p-0 overflow-hidden">
                        <Image
                          src={`/skins/${skin.id}.webp`}
                          alt={`Skin ${skin.id}`}
                          width={1000}
                          height={1000}
                          className="rounded-lg"
                        />
                      </CardContent>
                    </Card>

                    {skin.isBought ? (
                      skin.isUsed ? (
                        <Button className="mt-4 w-full cursor-pointer" disabled>
                          En cours d&apos;utilisation
                        </Button>
                      ) : (
                        <Button className="mt-4 w-full cursor-pointer" onClick={() => useSkin(skin.id)}>
                          Utiliser le skin ?
                        </Button>
                      )
                    ) : (
                      <Button className="mt-4 w-full cursor-pointer" onClick={() => buySkin(skin.id)}>
                        Acheter {skin.price} NFT
                      </Button>
                    )}

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
      ) : (
        <div>
          <p className="text-lg text-center text-gray-500">
            Tout le monde a besoin de papier toilette, même les non-connectés! 
            Connectez-vous pour avoir accès à notre collection de papiers toilettes! 🧻
          </p>
          <ConnectButton />
        </div>
      )}
    </div>
  );
}