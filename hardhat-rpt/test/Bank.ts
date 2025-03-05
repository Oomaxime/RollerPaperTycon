import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("Hetic", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployErc20Fixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, otherAccount2] =
      await hre.viem.getWalletClients();

    // deploy ERC20
    const ERC20 = await hre.viem.deployContract("Hetic");
    // deploy bank with erc20 in argument
    const Bank = await hre.viem.deployContract("Bank", [
      ERC20.address,
      owner.account.address,
    ]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      ERC20,
      Bank,
      owner,
      otherAccount,
      otherAccount2,
      publicClient,
    };
  }

  describe("Test bank", function () {
    it("Should mint & deposit & withdraw & pay", async function () {
      const { ERC20, Bank, owner, otherAccount, otherAccount2 } =
        await loadFixture(deployErc20Fixture);

      // mint 100 token for other account
      await ERC20.write.mint([otherAccount.account.address, 100n]);
      // mint 100 token for owner
      await ERC20.write.mint([owner.account.address, 100n]);

      // Verify
      const balanceOtherAccount = await ERC20.read.balanceOf([
        otherAccount.account.address,
      ]);
      expect(balanceOtherAccount).to.equal(100n);

      const balanceOwner = await ERC20.read.balanceOf([owner.account.address]);
      expect(balanceOwner).to.equal(100n);

      // Approve bank to spend 100 token
      await ERC20.write.approve([Bank.address, 100n], {
        account: otherAccount.account,
      });

      // // Deposit 100 token in bank from other account
      await Bank.write.deposit([100n], {
        account: otherAccount.account,
      });

      const balanceBank = await ERC20.read.balanceOf([Bank.address]);
      expect(balanceBank).to.equal(100n);

      // other Account withdraw from bank
      await Bank.write.withdraw([10n], {
        account: otherAccount.account,
      });

      // // Verify if other account has 10n
      const balance2 = await ERC20.read.balanceOf([
        otherAccount.account.address,
      ]);
      expect(balance2).to.equal(10n);

      // // Verify if bank has 90n
      const balance3 = await ERC20.read.balanceOf([Bank.address]);
      expect(balance3).to.equal(90n);

      await expect(
        Bank.write.withdraw([90n], {
          account: otherAccount2.account,
        })
      ).to.be.rejectedWith("Insufficient balance");

      await ERC20.write.approve([Bank.address, 10n], {
        account: owner.account,
      });

      // Pay employees only owner
      await Bank.write.pay([otherAccount.account.address, 10n], {
        account: owner.account,
      });
    });
  });
});
