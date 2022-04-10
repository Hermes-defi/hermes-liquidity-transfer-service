import {expect} from "chai";
import {ethers} from "hardhat";
import {utils} from 'ethers';

function toWei(v: string): string {
    return utils.parseUnits(v, 18).toString();
}

function fromWei(v: string): string {
    return utils.formatUnits(v, 18).toString();
}

function now(x: number) {
    let t = new Date().getTime() / 1000;
    t += x;
    return parseInt(t.toString());
}

async function getBlock() {
    return await ethers.provider.getBlockNumber();
}

let _01: string = toWei('0.1');
let _1: string = toWei('1');
let _50: string = toWei('50');
let _100: string = toWei('100');
let _1000: string = toWei('1000');
let _1T: string = toWei('1000000000000');
let _1M: string = toWei('1000000');
let _1and1M: string = toWei('1000001');

describe("Dibs", function () {
    it("simple transfer", async function () {
        const [_dev, _user1, _user2, _team, _treasure] = await ethers.getSigners();
        const dev = _dev.address;
        const user1 = _user1.address;
        const user2 = _user2.address;
        const team = _team.address;
        const treasure = _treasure.address;

        const _WTEST = await ethers.getContractFactory("WTEST");
        const _UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
        const _UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
        const _UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");

        this.weth = await _WTEST.deploy();
        this.factory = await _UniswapV2Factory.deploy();
        this.router = await _UniswapV2Router02.deploy();
        // const pairCodeHash = await this.factory.pairCodeHash();
        // console.log('pairCodeHash', pairCodeHash);
        await this.router.init(this.factory.address, this.weth.address);


        const Token = await ethers.getContractFactory("Token");
        const _taxRate = 1000;
        this.token = await Token.deploy(this.router.address);
        await this.token.deployed();
        await this.token.mint(dev, _1M);
        console.log('token', this.token.address);
        await this.token.approve(this.router.address, _1M);
        await this.token.connect(_user1).approve(this.router.address, _1M);
        await this.token.connect(_user2).approve(this.router.address, _1M);

        // console.log('user1', user1);
        // console.log('dev', dev);
        // console.log('token', this.token.address);
        // console.log('router', this.router.address);
        // const lp = await this.token.uniswapV2Pair();
        // console.log('lp', lp);

        expect(await this.token.balanceOf(dev)).to.equal(_1and1M);
        await this.router.addLiquidityETH(this.token.address, _1000, 0, 0, dev, 9646498066, {value: _100});

        await this.router.connect(_user1).swapExactETHForTokensSupportingFeeOnTransferTokens
        (0, [this.weth.address, this.token.address], user1, 9646498066, {from: user1, value: _1});
        const myTokens = await this.token.balanceOf(user1);

        await this.router.connect(_user1).swapExactTokensForETHSupportingFeeOnTransferTokens
        ('100', 0, [this.token.address, this.weth.address], user1, 9646498066, {from: user1});

        await this.router.connect(_user1).swapExactTokensForETHSupportingFeeOnTransferTokens
        ('100', 0, [this.token.address, this.weth.address], user1, 9646498066, {from: user1});

        let balanceOfTax = await this.token.provider.getBalance(team);
        console.log('balanceOfTax team', fromWei(balanceOfTax.toString()) );

        balanceOfTax = await this.token.provider.getBalance(treasure);
        console.log('balanceOfTax treasure', fromWei(balanceOfTax.toString()) );

    });
});
