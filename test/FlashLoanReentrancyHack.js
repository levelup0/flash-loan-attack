const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Test Flash Loan Reentrancy Attack', function () {
    const ETHERS = ethers.utils.parseEther('5431');
    let user, hacker;
    before(async function () {
        [user, hacker] = await ethers.getSigners();
        const MyFactory = await ethers.getContractFactory('FlashLenderPool', user);
        this.pool = await MyFactory.deploy();
        await this.pool.pay({ value: ETHERS });
        this.hacker = await ethers.provider.getBalance(hacker.address);
        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.equal(ETHERS);
    });

    it('Execute the exploit', async function () {
        const MyExploitFactory = await ethers.getContractFactory('FlashLoanReentrancyExploit', hacker);
        const hack = await MyExploitFactory.deploy(this.pool.address, ETHERS);
        await hack.hack();
    });

    after(async function () {
        expect(
            await ethers.provider.getBalance(this.pool.address)
        ).to.be.equal('0');
        
        expect(
            await ethers.provider.getBalance(hacker.address)
        ).to.be.gt(this.attackerInitialEthBalance);
    });
});
