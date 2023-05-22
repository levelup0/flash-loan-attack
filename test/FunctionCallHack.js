const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Test Function Call Attack', function () {
    const TOKENS = ethers.utils.parseEther('5432845');
    let user, hacker;
    before(async function () {
        [user, hacker] = await ethers.getSigners();
        const MyTokenFactory = await ethers.getContractFactory('MyERC20Token', user);
        const MyPoolFactory = await ethers.getContractFactory('MyERC20Pool2', user);
        this.token = await MyToken.deploy();
        this.pool = await MyPoolFactory.deploy(this.token.address);
        await this.token.transfer(this.pool.address, TOKENS);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS);
        expect(
            await this.token.balanceOf(hacker.address)
        ).to.equal('0');
    });

    it('Execute the exploit', async function () {
        const MyExploitFactory = await ethers.getContractFactory('FunctionCallExploit', hacker);
        await MyExploitFactory.deploy(this.pool.address, this.token.address, TOKENS)
    });

    after(async function () {
        expect(
            await this.token.balanceOf(hacker.address)
        ).to.equal(TOKENS);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal('0');
    });
});

