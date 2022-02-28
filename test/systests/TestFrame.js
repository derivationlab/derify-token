const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const HDWalletProvider = require("@truffle/hdwallet-provider");

const abiDRF = require('../../build/contracts/DRF.json').abi;
const abiTeamVestingVault = require('../../build/contracts/TeamVestingVault.json').abi;
const abiPrivateVestingVault = require('../../build/contracts/PrivateVestingVault.json').abi;
const abiCommunityVestingVault = require('../../build/contracts/CommunityVestingVault.json').abi;

const configs = require('../../configs');


const fromTokenDecimals = 18;
const fromContractDecimals = 8;
const gasPrice = 2e10;  //20 gwei
const gasLimit = 1e8;

module.exports = class TestFrame { 
    constructor(network, configs){
        this.network = network;
        this.configs = configs;
        this.web3 = new Web3(new HDWalletProvider({
            privateKeys: [
                configs.privateKeyDeployAccount, 
                configs.privateKeyAccountTeam,
                configs.privateKeyAccountPrivate,
                configs.privateKeyAccountCommunity,
                configs.privateKeyAccountPublic,
                configs.privateKeyAccountStrategy,
                configs.privateKeyAccountA,
                configs.privateKeyAccountB,
                configs.privateKeyAccountC,
                configs.privateKeyAccountD,
            ],
            providerOrUrl: this.configs.networkWssUrl,
            pollingInterval: 300000
        }));

        this.drfInstance = new this.web3.eth.Contract(abiDRF, this.configs.tokenDRF);
        this.teamVestingVaultInstance = new this.web3.eth.Contract(abiTeamVestingVault, this.configs.teamVestingVaultAddr);
        this.privateVestingVaultInstance = new this.web3.eth.Contract(abiPrivateVestingVault, this.configs.privateVestingVaultAddr);
        this.communityVestingVaultInstance = new this.web3.eth.Contract(abiCommunityVestingVault, this.configs.communityVestingVaultAddr);  
    }
    /**** WRITE ****/
    async transferOwner() {
        let res;

        res = await await this.teamVestingVaultInstance.methods.transferOwnership(this.configs.founderTeamAccount).send({
            from: this.configs.deployAccount,
            gasPrice: gasPrice
        });
        console.log(`teamVestingVaultInstance transferOwnership with ${this.configs.founderTeamAccount} res: ${JSON.stringify(res.transactionHash)}`);

        res = await await this.privateVestingVaultInstance.methods.transferOwnership(this.configs.peInvestorsAccount).send({
            from: this.configs.deployAccount,
            gasPrice: gasPrice
        });
        console.log(`privateVestingVaultInstance transferOwnership with ${this.configs.peInvestorsAccount} res: ${JSON.stringify(res.transactionHash)}`);

        res = await await this.communityVestingVaultInstance.methods.transferOwnership(this.configs.communityFundAccount).send({
            from: this.configs.deployAccount,
            gasPrice: gasPrice
        });
        console.log(`communityVestingVaultInstance transferOwnership with ${this.configs.communityFundAccount} res: ${JSON.stringify(res.transactionHash)}`);
    }

    async lockToken() {
        let res;
        // initial teamVestingVaultInstance
        const teamTotalVestingAmount = await this.drfInstance.methods.balanceOf(this.configs.founderTeamAccount).call();
        console.log(`drf balance of ${this.configs.founderTeamAccount}: ${teamTotalVestingAmount}`);
        const teamTotalVestingAmountBN = new BigNumber(teamTotalVestingAmount);
        res = await this.drfInstance.methods.approve(this.configs.teamVestingVaultAddr, teamTotalVestingAmountBN).send({
            from: this.configs.founderTeamAccount,
            gasPrice: gasPrice,
        });
        console.log(`approve drf amount of ${this.configs.founderTeamAccount} res: ${JSON.stringify(res.transactionHash)}`);

        res = await this.teamVestingVaultInstance.methods.lockToken(
            teamTotalVestingAmountBN
        ).send({
            from: this.configs.founderTeamAccount,
            gasPrice: gasPrice
        });
        console.log(`teamVestingVaultInstance lockToken res: ${JSON.stringify(res.transactionHash)}`);

        // initial privateVestingVaultInstance
        const privateTotalVestingAmount = await this.drfInstance.methods.balanceOf(this.configs.peInvestorsAccount).call();
        console.log(`drf balance of ${this.configs.peInvestorsAccount}: ${privateTotalVestingAmount}`);
        const privateTotalVestingAmountBN = new BigNumber(privateTotalVestingAmount);
        res = await this.drfInstance.methods.approve(this.configs.privateVestingVaultAddr, privateTotalVestingAmountBN).send({
            from: this.configs.peInvestorsAccount,
            gasPrice: gasPrice
        });
        console.log(`approve drf amount of ${this.configs.peInvestorsAccount} res: ${JSON.stringify(res.transactionHash)}`);

        res = await this.privateVestingVaultInstance.methods.lockToken(
            privateTotalVestingAmountBN
        ).send({
            from: this.configs.peInvestorsAccount,
            gasPrice: gasPrice
        });
        console.log(`privateVestingVaultInstance lockToken res: ${JSON.stringify(res.transactionHash)}`);
        
        // initial communityVestingVaultInstance
        const communityTotalVestingAmount = await this.drfInstance.methods.balanceOf(this.configs.communityFundAccount).call();
        console.log(`drf balance of ${this.configs.communityFundAccount}: ${communityTotalVestingAmount}`);
        const communityTotalVestingAmountBN = new BigNumber(communityTotalVestingAmount);
        res = await this.drfInstance.methods.approve(this.configs.communityVestingVaultAddr, communityTotalVestingAmountBN).send({
            from: this.configs.communityFundAccount,
            gasPrice: gasPrice
        });
        console.log(`approve drf amount of ${this.configs.communityFundAccount} res: ${JSON.stringify(res.transactionHash)}`);
        res = await this.communityVestingVaultInstance.methods.lockToken(
            communityTotalVestingAmountBN
        ).send({
            from: this.configs.communityFundAccount,
            gasPrice: gasPrice
        });
        console.log(`communityVestingVaultInstance lockToken res: ${JSON.stringify(res.transactionHash)}`);
    }

    async addGrantOfTeam(recipient, amount, vestingDurationInDays, vestingCliffInDays) {
        const amountBN = new BigNumber(amount).shiftedBy(fromTokenDecimals).toFixed();
        let res1 = await this.teamVestingVaultInstance.methods.addGrant(
            recipient,
            amountBN,
            vestingDurationInDays,
            vestingCliffInDays
        ).send({
            from: this.configs.founderTeamAccount,
            gasPrice: gasPrice
        });
        console.log(`teamVestingVaultInstance addGrant of ${recipient} res: ${JSON.stringify(res1.transactionHash)}`);
    }

    async addGrantOfPrivate(recipient, amount, startVestingAmount, vestingDurationInDays, vestingCliffInDays) {
        const amountBN = new BigNumber(amount).shiftedBy(fromTokenDecimals).toFixed();
        const startVestingAmountBN = new BigNumber(startVestingAmount).shiftedBy(fromTokenDecimals).toFixed();
        let res1 = await this.privateVestingVaultInstance.methods.addGrant(
            recipient,
            amountBN,
            startVestingAmountBN,
            vestingDurationInDays,
            vestingCliffInDays
        ).send({
            from: this.configs.peInvestorsAccount,
            gasPrice: gasPrice
        });
        console.log(`privateVestingVaultInstance addGrant of ${recipient} res: ${JSON.stringify(res1.transactionHash)}`);
    }

    async claimVestedTokens(recipient, vestingVaultInstance) {
        let res1 = await vestingVaultInstance.methods.claimVestedTokens(
        ).send({
            from: recipient,
            gasPrice: gasPrice
        });
        console.log(`claimVestedTokens of ${recipient} res: ${JSON.stringify(res1.transactionHash)}`);
    }

    async revokeGrant(recipient, vestingVaultInstance, owner) {
        let res1 = await vestingVaultInstance.methods.revokeGrant(
            recipient
        ).send({
            from: owner,
            gasPrice: gasPrice
        });
        console.log(`revokeGrant of ${recipient} res: ${JSON.stringify(res1.transactionHash)}`);
    }

    /**** READ ****/
    async checkOwners() {
        let res;

        res = await this.teamVestingVaultInstance.methods.owner().call();
        console.log(`teamVestingVaultInstance owner res: ${JSON.stringify(res)}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        res = await this.teamVestingVaultInstance.methods.getTotalVestingAmount().call();
        console.log(`teamVestingVaultInstance getTotalVestingAmount res: ${JSON.stringify(res)}`);

        res = await this.privateVestingVaultInstance.methods.owner().call();
        console.log(`privateVestingVaultInstance owner res: ${JSON.stringify(res)}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        res = await this.privateVestingVaultInstance.methods.getTotalVestingAmount().call();
        console.log(`privateVestingVaultInstance getTotalVestingAmount res: ${JSON.stringify(res)}`);

        res = await this.communityVestingVaultInstance.methods.owner().call();
        console.log(`communityVestingVaultInstance owner res: ${JSON.stringify(res)}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        res = await this.communityVestingVaultInstance.methods.getTotalVestingAmount().call();
        console.log(`communityVestingVaultInstance getTotalVestingAmount res: ${JSON.stringify(res)}`);
    }

    async getTotalVestingAmount(vestingVaultInstance) {
        let res = await vestingVaultInstance.methods.getTotalVestingAmount().call();
        console.log(`getTotalVestingAmount res: ${JSON.stringify(res)}`);
    }

    async getGrant(accountX, vestingVaultInstance) {
        let res; 
        res = await vestingVaultInstance.methods.getGrant(accountX).call();
        console.log(`getGrant of ${accountX} res: ${JSON.stringify(res)}`);
        return res;
    }

    async getVestedAmount(accountX, vestingVaultInstance) {
        let res;
        res = await vestingVaultInstance.methods.calculateGrantClaim(accountX).call();
        console.log(`calculateGrantClaim of ${accountX} res: ${JSON.stringify(res)}`);
    }
}