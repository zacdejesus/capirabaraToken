const Token = artifacts.require("MyToken");

const chai = require("./setupchai");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async accounts => {
    
    const [ deployerAccounts, recipient, anotherAccount ] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(1000000);
    }) 

    it("All tokens should be in my account", async () => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();

    return expect(instance.balanceOf(deployerAccounts)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("is possible to send tokens bwtween accounts", async() =>{
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccounts)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("It's not possible to send more tokens than account 1 has", async () => {
        const sendTokens = 100000000000;
        let instance = this.myToken;
        return expect(instance.transfer(recipient, sendTokens)).to.eventually.be.rejected;
        });
});