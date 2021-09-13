const MyToken = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");

const chai = require("./setupchai");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({ path: "../.env" });

contract("token sale test", async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  it("should not have any token in my deployerAccount", async () => {
    let instance = await MyToken.deployed();
    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  //other code in test

  it("all coins should be in the tokensale smart contract", async () => {
    let instance = await MyToken.deployed();
    let balance = await instance.balanceOf.call(TokenSale.address);
    let totalSupply = await instance.totalSupply.call();
    return expect(balance).to.be.a.bignumber.equal(totalSupply);
  });

  it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
    let tokenInstance = await MyToken.deployed();
    let tokenSaleInstance = await TokenSale.deployed();
    let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);

    await expect(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: web3.utils.toWei("1", "wei"),
      })
    ).to.be.fulfilled;
    return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(
      await tokenInstance.balanceOf.call(recipient)
    );
  });
});
