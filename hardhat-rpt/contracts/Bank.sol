// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.2.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/**
 * @title Bank
 * @dev Implémentation d'un contrat bancaire pour gérer les dépôts et les retraits de fonds
 * @notice Le contrat Bank permet aux utilisateurs de déposer et de retirer des fonds d'un contrat ERC20 spécifié
 * @dev Le constructeur initialise le contrat avec l'adresse du contrat ERC20 et l'adresse du propriétaire
 */
contract Bank {

    address immutable public erc20;

    mapping(address => uint256) public balances;

    address immutable public owner;

    /**
     * @notice Modifier pour vérifier si l'appelant est le propriétaire du contrat
     * @dev La fonction permet de vérifier si l'appelant est le propriétaire du contrat
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _erc20, address _owner) {
        erc20 = _erc20;
        owner = _owner;
    }

    /**
     * @notice Fonction pour déposer des fonds dans le contrat
     * @dev La fonction permet de déposer des fonds d'un contrat ERC20 spécifié
     * @dev Ne pas oublier d'approve avant le contract de bank pour faire un transferFrom
     * @param amount Le nombre d'unités de token à déposer
     */
    function deposit(uint256 amount) public {
        IERC20(erc20).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    /**
     * @notice Fonction pour retirer des fonds du contrat
     * @dev La fonction permet de retirer des fonds d'un contrat ERC20 spécifié
     * @param amount Le nombre d'unités de token à retirer
     */
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        IERC20(erc20).transfer(msg.sender, amount);
    }

    /**
     * @notice Fonction pour payer un employé
     * @dev La fonction permet de payer un employé avec des fonds d'un contrat ERC20 spécifié
     * @dev Ne pas oublier d'approve avant le contract de bank pour faire un transferFrom
     * @param employee L'adresse de l'employé à payer
     * @param amount Le nombre d'unités de token à payer
     */
    function pay(address employee, uint256 amount) public onlyOwner {
        IERC20(erc20).transferFrom(owner, address(this), amount);
        balances[employee] += amount;
    }
}