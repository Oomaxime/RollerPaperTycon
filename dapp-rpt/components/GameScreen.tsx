"use client";

import React from "react";
import { RPT_ABI } from "@/data/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ArrowAnimation from "./ArrowAnimation";
import { Icon } from "@iconify/react";

const RPT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function GameScreen() {
  const { writeContract } = useWriteContract();
  const { address, isConnected } = useAccount();

  const [score, setScore] = React.useState(() => {
    if (typeof window !== "undefined") {
      const savedScore = localStorage.getItem("rptScore");
      return savedScore ? parseInt(savedScore, 10) : 0;
    }
    return 0;
  });

  const [bigIntScore, setBigIntScore] = React.useState<bigint>(0n);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rptScore", score.toString());
    }
    setBigIntScore(BigInt(score));
  }, [score]);

  React.useEffect(() => {
    if (!isConnected) {
      setScore(0);
      if (typeof window !== "undefined") {
        localStorage.setItem("rptScore", "0");
      }
    }
  }, [isConnected]);

  const { data: balance, refetch } = useReadContract({
    abi: RPT_ABI,
    functionName: "balanceOf",
    address: RPT_ADDRESS,
    args: address ? [address] : undefined,
  });

  const handleMintClick = () => {
    if (!address) return;
    writeContract(
      {
        abi: RPT_ABI,
        functionName: "mint",
        address: RPT_ADDRESS,
        args: [address, bigIntScore],
      },
      {
        onSuccess: () => {
          toast.success("Minting successful");
          refetch();
        },
        onError: () => {
          toast.error("Minting failed");
        },
      }
    );
  };

  const handleAddScore = () => {
    setScore(score + 1);
  };

  return (
    <div className="flex flex-col items-center min-h-screen overflow-hidden">
      {isConnected ? (
        <div className="flex flex-col items-center gap-6 w-full p-5 min-h-screen">
          <div className="flex items-center justify-end w-full">
            <ConnectButton accountStatus="avatar" chainStatus="none" />
          </div>
          <h1 className="text-3xl font-bold italic mb-2 text-gray-800">
            Roller Paper Tycoon
          </h1>
          {/* A remplacer par le vrais rouleau de papier toilette fait pas louis */}
          <div className="w-80 h-80 bg-red-200 rounded-full flex items-center justify-center">
            <Button onClick={handleAddScore}>+</Button>
          </div>
          <p className="text-5xl font-bold text-gray-900 italic">{score}</p>
          <Button onClick={handleMintClick} className="">
            Convertir en RPT
          </Button>

          <div className="flex w-full justify-end items-center absolute bottom-4 right-8 gap-2">
            <p className="text-gray-900 font-medium text-xl">
              {balance?.toString()} RPT
            </p>
            <span className="text-gray-900 font-medium text-xl">-</span>
            {/* Bouton pour ouvrir la boutique qui doit être remplacer par le travail d'alexis et hugo */}
            <Button className="bg-gray-900 font-medium text-xl w-9 h-9 flex items-center justify-center">
              <Icon icon="mdi:shopping" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10 p-8 relative">
          <h1 className="text-8xl text-center font-bold italic mb-2 text-gray-900">
            Roller Paper Tycoon
          </h1>

          <p className="text-gray-800 text-center font-bold text-2xl">
            Hola cowboy ! 🤠 Tu veux dérouler du papier toilette ?! Devenir
            l&apos;heureux propriétaire des plus grand rouleaux de ce monde ?!
          </p>

          <ConnectButton
            label="Connecte toi !"
            accountStatus="avatar"
            chainStatus="none"
          />
          <ArrowAnimation />
        </div>
      )}
    </div>
  );
}
