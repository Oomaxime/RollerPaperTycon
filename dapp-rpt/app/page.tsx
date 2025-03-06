import GameScreen from "@/components/GameScreen";

export default function Blockchain() {
  const { writeContract } = useWriteContract();
  const { address, isConnected } = useAccount();

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

  return (
    <div>
      <main>
        <GameScreen />
      </main>
    </div>
  );
}
