import { RPT_ABI } from "@/data/RollerPaperTycoon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useState } from "react";


const ToiletPaper = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [repetition, setRepetition] = useState(1);
    const [empty, setEmpty] = useState(100);
    
    const divs = [];
    
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
            setEmpty(empty > 0 ? empty - 1 : 0);
            console.log('L\'utilisateur a glissé vers le bas');
        } else {
            console.log('L\'utilisateur n\'a pas glissé vers le bas');
        }
        setOffsetY(0);
    };
    
    return (
        <div>
            <div className="relative flex flex-col justify-top items-center w-full h-[30rem] overflow-hidden">
                    <div className="flex justify-center items-center bg-amber-400 w-[22rem] h-[14rem]">
                    <div className="flex items-center justify-center w-full">
                        <div 
                        className="flex items-center justify-center rounded-[100%] left-0 z-100 border-blue-200 border-[.2rem] bg-amber-100"
                        style={{
                            height: 14 * (empty/100) + 'rem',
                            width: 8 * (empty/100) + 'rem' 
                        }}
                        >
                        </div>
                        <div 
                        className="relative flex justify-center h-[14rem] "
                        style={{
                        width: 14 - 8 * (empty/100) + 'rem'
                        }}>
                        <hr className="absolute border-[2px] w-full border-t-0 border-blue-200" />
                        <div key={0} className="absolute top-27 bg-amber-100 left-0 z-110 w-[14rem] h-[14rem] border-[2px] border-t-0 border-blue-200 border-t-dashed "></div>
                        <div 
                            onDragStart={handleMouseDown} 
                            onDrag={handleMouseMove} 
                            onDragEnd={handleMouseUp} 
                            className="absolute flex flex-col w-[14rem] min-h-[14rem] top-27 z-110 border-blue-200 border-t-none border-l-[.2rem] border-r-[.2rem] border-b-[.2rem] "
                            style={{
                                left: 0 + 'rem',
                                transform: `translateY(${offsetY > 0 ? offsetY > 218 ? 218 : offsetY : 0}px)`,
                                transition: 'transform 0.01s ease-in-out'
                            }}
                        >
        
                            {Array.from({ length: Math.min(repetition, 10) }, (_, index) => (
                                <div key={index} className="bg-amber-100 w-full h-[14rem] border-t-[2px] border-dashed border-blue-200"></div>
                            ))}
                        </div>
                        </div>
                        <div 
                        className="relative flex items-center justify-center rounded-[100%] left-0 z-10 border-blue-200 border-[.2rem] bg-amber-100"
                        style={{
                            height: 14 * (empty/100) + 'rem',
                            width: 8 * (empty/100) + 'rem' 
                        }}
                        >
                        </div>
                    </div>
                    <div className="absolute w-[22rem] h-[14rem] flex items-center justify-center">
                        <div 
                        className="relative w-[14rem] h-[14rem] bg-amber-100 border-t-[2px] border-b-[2px]  border-blue-200 z-20 overflow-hidden"
                        style={{
                            height: 14 * (empty/100) + 'rem' 
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
            </div>
    )
}

export { ToiletPaper }