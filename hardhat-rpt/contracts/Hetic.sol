// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.2.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Hetic
 * @dev Implémentation de l'ERC20 pour créer le token Hetic
 * @notice Le token Hetic est un token ERC20 standard avec une fonction mint pour créer des nouvelles unités de token
 * @dev Le constructeur initialise le token avec le nom "Hetic" et le symbole "HETIC"
 */
contract Hetic is ERC20 {
    /**
     * @notice Le smart contract hérite du smart contract ERC20 de OpenZeppelin
     * @dev Appelle le constructeur de la classe ERC20 avec le nom "Hetic" et le symbole "HETIC"
     */
    constructor() ERC20("Hetic", "HETIC") {}

    /**
     * @notice Fonction pour créer des nouvelles unités de token et de les assigner à un adresse spécifiée
     * @dev La fonction mint est publique et peut être appelée par n'importe qui
     * @param to L'adresse à laquelle les nouvelles unités de token seront assignées
     * @param amount Le nombre d'unités de token à créer
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}