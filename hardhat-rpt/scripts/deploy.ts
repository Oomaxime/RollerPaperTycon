import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import path from "path";

async function main() {
    const hre: HardhatRuntimeEnvironment = await import("hardhat");

    const RollerPaperTycoon = await hre.viem.deployContract("RollerPaperTycoon");

    console.log("RollerPaperTycoon déployé à l'adresse :", RollerPaperTycoon.address);
    const contractAddress = {
        address: RollerPaperTycoon.address,
    };
    fs.writeFileSync(
        path.join(__dirname, "../../dapp-rpt/public/contract-address.json"),
        JSON.stringify(contractAddress, null, 2)
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});