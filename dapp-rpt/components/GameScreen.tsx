"use client";

import React, { use, useEffect } from "react";
import { RPT_ABI } from "@/data/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ArrowAnimation from "./ArrowAnimation";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Link from "next/link";

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


  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [repetition, setRepetition] = useState(1);
  const [empty, setEmpty] = useState(100);

  const [color, setColor] = useState("#f8d6ff")

  useEffect(() => {
    setColor(localStorage.getItem("skin_color") || "#f8d6ff");
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };
  
  const handleMouseMove = (e) => {
      if (!isDragging) return;
      const currentY = e.clientY;
      const newOffsetY = currentY !== 0 ? currentY - startY : offsetY;
      setOffsetY(newOffsetY);
  };
  
  const handleMouseUp = () => {
      setIsDragging(false);
      if (offsetY > 0) {
          setRepetition(repetition + 1);
          handleAddScore()
          setEmpty(empty > 0 ? empty - 1 : 0);
          console.log('L\'utilisateur a glissé vers le bas');
      } else {
          console.log('L\'utilisateur n\'a pas glissé vers le bas');
      }
      setOffsetY(0);
  };

  const mouseClick = () => {

    if (empty > 70) {
      setRepetition(repetition + 1);
      handleAddScore()
      setEmpty(empty > 0 ? empty - 1 : 0);
    } else {
      while (empty < 100) {
        setEmpty(empty + 1)
        console.log(empty + 1)
        setTimeout(()=>{}, 20000)
      }
    }

  }

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
          <div className="relative flex flex-col justify-top items-center w-full h-[30rem] overflow-hidden">
            <div className="flex justify-center items-center w-[22rem] h-[14rem]">
              <div className="flex items-center justify-center w-full">
                <div 
                className="flex items-center justify-center rounded-[100%] left-0 z-100 border-blue-200 border-[.2rem]"
                style={{
                    height: 14 * (empty/100) + 'rem',
                    width: 8 * (empty/100) + 'rem',
                    backgroundColor: color
                }}
                >
                  <div
                    className="relative flex items-center justify-center rounded-[100%] left-0 z-10 border-[#665d44] border-[.2rem] bg-[#a1936c]"
                    style={{
                      height: 5 + "rem",
                      width: 3 + "rem"
                    }}
                  >
                  </div>
                </div>
                <div 
                  className="relative flex justify-center h-[14rem] "
                  style={{
                  width: 14 - 8 * (empty/100) + 'rem'
                }}>
                <div 
                  key={0} 
                  className="absolute top-27 left-0 z-110 w-[14rem] h-[14rem] border-[2px] border-t-0 border-blue-200 border-t-dashed "
                  style={{
                    backgroundColor: color
                  }}
                ></div>
                <div 
                    onDragStart={handleMouseDown} 
                    onDrag={handleMouseMove} 
                    onDragEnd={handleMouseUp} 
                    onClick={mouseClick}
                    className="absolute flex flex-col w-[14rem] min-h-[14rem] top-27 z-110 border-blue-200 border-t-none border-l-[.2rem] border-r-[.2rem] border-b-[.2rem] "
                    style={{
                        left: 0 + 'rem',
                        transform: `translateY(${offsetY > 0 ? offsetY > 218 ? 218 : offsetY : 0}px)`,
                        transition: 'transform 0.01s ease-in-out'
                    }}
                >
                    {Array.from({ length: Math.min(repetition, 10) }, (_, index) => (
                        <div 
                          key={index} 
                          className="w-full h-[14rem] border-t-[2px] border-dashed border-blue-200"
                          style={{
                          backgroundColor: color
                        }}
                        ></div>
                    ))}
                </div>
                </div>
                <div 
                className="relative flex items-center justify-center rounded-[100%] left-0 z-10 border-blue-200 border-[.2rem]"
                style={{
                    height: 14 * (empty/100) + 'rem',
                    width: 8 * (empty/100) + 'rem',
                    backgroundColor: color
                }}
                >
                  <div 
                    className="absolute w-full h-[14rem] border-t-[2px] border-b-[2px] z-120 border-blue-200 border-dashed" 
                    style={{
                    top: - 25 + 'rem' ,
                    transform: `translateY(${offsetY > 0 ? offsetY > 216 ? 216 : offsetY : 0}px)`,
                    transition: 'transform 0.01s ease-in-out'}}>
                  </div>
                </div>
              </div>
              <div className="absolute w-[22rem] h-[14rem] flex items-center justify-center">
                <div 
                className="relative w-[14rem] h-[14rem] border-t-[2px] border-b-[2px]  border-blue-200 z-20 overflow-hidden"
                style={{
                    height: 14 * (empty/100) + 'rem',
                    backgroundColor: color
                }}
                >
                <div 
                    className="absolute w-full h-[14rem] border-t-[2px] border-b-[2px] z-120 border-blue-200 border-dashed" 
                    style={{
                    top: - 25 + 'rem' ,
                    transform: `translateY(${offsetY > 0 ? offsetY > 216 ? 216 : offsetY : 0}px)`,
                    transition: 'transform 0.01s ease-in-out'}}>
                </div>
              </div>
            </div>
            </div>
          </div>
          {/* <div className="w-80 h-80 bg-red-200 rounded-full flex items-center justify-center">
            <Button onClick={handleAddScore}>+</Button>
          </div> */}
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
            <Link href="/store">
              <Button className="bg-gray-900 font-medium text-xl w-9 h-9 flex items-center justify-center cursor-pointer">
                <Icon icon="mdi:shopping" />
              </Button>
            </Link>
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
