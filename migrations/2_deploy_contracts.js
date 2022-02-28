const DRF = artifacts.require("DRF");
const TeamVestingVault = artifacts.require("TeamVestingVault");
const CommunityVestingVault = artifacts.require("CommunityVestingVault");
const PrivateVestingVault = artifacts.require("PrivateVestingVault");

const configs = require('../configs');

module.exports = async function (deployer, network, accounts) {
    let drf;

    if (network == 'development') {
        console.log("Deploying with development network...");
        console.log("Accounts: " + accounts);
        await deployer.deploy(DRF, accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]);
        drf = await DRF.deployed();
        console.log("Deployed DRF: " + drf.address);
    } else if (network == 'bsctestnet') {
        console.log("Deploying with bsctestnet network...");
        console.log("Accounts: " + accounts);
        await deployer.deploy(
            DRF, 
            configs.founderTeamAccount, 
            configs.peInvestorsAccount, 
            configs.publicSaleAccount, 
            configs.strategicReserveAccount, 
            configs.communityFundAccount
        );
        drf = await DRF.deployed();
        console.log("Deployed DRF: " + drf.address);
    } else if (network == 'bsc') {
        console.log("Deploying with bsc network...");
        console.log("Accounts: " + accounts);
        await deployer.deploy(
            DRF, 
            configs.founderTeamAccount, 
            configs.peInvestorsAccount, 
            configs.publicSaleAccount, 
            configs.strategicReserveAccount, 
            configs.communityFundAccount
        );
        drf = await DRF.deployed();
        console.log("Deployed DRF: " + drf.address);
    }


    await deployer.deploy(
        TeamVestingVault, 
        drf.address
    );
    const teamVestingVault = await TeamVestingVault.deployed();
    console.log("Deployed TeamVestingVault: " + teamVestingVault.address);

    await deployer.deploy(
        CommunityVestingVault, 
        drf.address
    );
    const communityVestingVault = await CommunityVestingVault.deployed();
    console.log("Deployed CommunityVestingVault: " + communityVestingVault.address);

    await deployer.deploy(
        PrivateVestingVault, 
        drf.address
    );
    const privateVestingVault = await PrivateVestingVault.deployed();
    console.log("Deployed PrivateVestingVault: " + privateVestingVault.address);
};
