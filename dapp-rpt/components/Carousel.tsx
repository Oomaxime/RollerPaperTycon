"use client"

import { RPT_ABI } from "@/public/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, GalleryHorizontal } from 'lucide-react';
import { FaToiletPaper } from "react-icons/fa";


export default function Blockchain() {

  // localStorage.clear()

  // Déclaration du tableau de couleurs
  const COLORS_PAPERS = [
    "#f5f5f5",
    "#f0e68c",
    "#ffcccb",
    "#ff69b4",
    "#ff4500",
  ];

  interface Skin {
    id: number;
    isBought: boolean;
    isUsed: boolean;
  }
  
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { address, isConnected } = useAccount();

  // Gestion des skins sous forme d'un tableau [{ id: 0, isBought: false, isUsed: false }, ...]
  const [skins, setSkins] = useState<Skin[]>(() => {
    const savedSkins = localStorage.getItem("skins");
    return savedSkins ? JSON.parse(savedSkins) : Array.from({ length: 5 }, (_, index) => ({
      id: index,
      isBought: false,
      isUsed: false,
    }));
  });
  
  // Sauvegarder les skins dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("skins", JSON.stringify(skins));
  }, [skins]);

  const buySkin = (skinId: number) => {
    setSkins((prevSkins) =>
      prevSkins.map((skin) =>
        skin.id === skinId ? { ...skin, isBought: true } : skin
      )
    );
  };

  const useSkin = (skinId: number) => {
    console.log("useSkin déclenché pour le skin", skinId);
    setSkins((prevSkins) =>
      prevSkins.map((skin) => ({
        ...skin,
        isUsed: skin.id === skinId,
      }))
    );
    localStorage.setItem("skin_color", JSON.stringify(COLORS_PAPERS[skinId]));
    console.log("Couleur sauvegardée:", localStorage.getItem("skin_color"));
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
                      <CardContent className="p-0 overflow-hidden flex justify-center items-center" >
                        <FaToiletPaper size={300} color={COLORS_PAPERS[skin.id]}  />
                      </CardContent>
                    </Card>

                    {skin.isBought ? (
                      skin.isUsed ? (
                        <Button className="mt-4 w-full cursor-pointer" disabled>
                          En cours d'utilisation
                        </Button>
                      ) : (
                        <Button className="mt-4 w-full cursor-pointer" onClick={() => useSkin(skin.id)}>
                          Utiliser le skin ?
                        </Button>
                      )
                    ) : (
                      <Button className="mt-4 w-full cursor-pointer" onClick={() => buySkin(skin.id)}>
                        Acheter
                      </Button>
                    )}

                    {isPending && <p className="text-yellow-500">Achat en cours...</p>}
                    {isSuccess && <p className="text-green-500">Achat effectué !</p>}
                    {isError && <p className="text-red-500">Achat annulé.</p>}
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
