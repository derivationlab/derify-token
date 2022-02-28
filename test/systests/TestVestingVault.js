const TestFrame = require('./TestFrame.js');
const configs = require('../../configs');


async function teamVestingVaultTestCaseA(tf) {
    // add grant accountA:
    await tf.addGrantOfTeam(configs.accountA, 10000, 3, 0);
    await tf.getGrant(configs.accountA, tf.teamVestingVaultInstance);
    await tf.getTotalVestingAmount(tf.teamVestingVaultInstance);

    // case-1: check released grant after grant
    // case-2: check released grant after 1 day
    // case-3: check released grant after 2 days - vesting durations done
    await tf.getVestedAmount(configs.accountA, tf.teamVestingVaultInstance);

    // case-1: claim vested token after grant
    // case-2: claim vested token after 1 day
    // case-3: claim vested token after 2 days - vesting durations done
    await tf.claimVestedTokens(configs.accountA, tf.teamVestingVaultInstance);
    await tf.getGrant(configs.accountA, tf.teamVestingVaultInstance);
    await tf.getVestedAmount(configs.accountA, tf.teamVestingVaultInstance);
}

async function teamVestingVaultTestCaseB(tf) {
    // add grant accountB:
    await tf.addGrantOfTeam(configs.accountB, 10000, 10, 1);
    await tf.getGrant(configs.accountB, tf.teamVestingVaultInstance);
    await tf.getTotalVestingAmount(tf.teamVestingVaultInstance);

    // case-1: check and claim released grant after grant
    // case-2: check and claim released grant after 1 day
    await tf.getVestedAmount(configs.accountB, tf.teamVestingVaultInstance);

    // case-1: claim vested token after 1 day
    // case-2: claim vested token after 2 days
    await tf.claimVestedTokens(configs.accountB, tf.teamVestingVaultInstance);
    await tf.getGrant(configs.accountB, tf.teamVestingVaultInstance);
    await tf.getVestedAmount(configs.accountB, tf.teamVestingVaultInstance);

    // revoke grant after 2 day: accountB
    await tf.revokeGrant(configs.accountB, tf.teamVestingVaultInstance, configs.founderTeamAccount);
    await tf.getGrant(configs.accountB, tf.teamVestingVaultInstance);
    await tf.getTotalVestingAmount(tf.teamVestingVaultInstance);
}

async function privateVestingVaultTestC(tf) {
    // add grant accountC:
    await tf.addGrantOfPrivate(configs.accountC, 10000, 3000, 2, 0);
    await tf.getGrant(configs.accountC, tf.privateVestingVaultInstance);
    await tf.getTotalVestingAmount(tf.privateVestingVaultInstance);

    // case-1: check released grant after grant
    // case-2: check released grant after 1 day
    // case-3: check released grant after 2 days - vesting durations done
    await tf.getVestedAmount(configs.accountC, tf.privateVestingVaultInstance);

    // claim vested token after 2 days - vesting durations done
    await tf.claimVestedTokens(configs.accountC, tf.privateVestingVaultInstance);
    await tf.getGrant(configs.accountC, tf.privateVestingVaultInstance);
    await tf.getVestedAmount(configs.accountC, tf.privateVestingVaultInstance);
}

async function privateVestingVaultTestD(tf) {
    // add grant accountD:
    await tf.addGrantOfPrivate(configs.accountD, 10000, 3000, 10, 1);
    await tf.getGrant(configs.accountD, tf.privateVestingVaultInstance);
    await tf.getTotalVestingAmount(tf.privateVestingVaultInstance);

    // case-1: check released grant after grant
    // case-2: check released grant after 1 day
    await tf.getVestedAmount(configs.accountD, tf.privateVestingVaultInstance);

    // claim vested token after 1 day
    await tf.claimVestedTokens(configs.accountD, tf.privateVestingVaultInstance);
    await tf.getGrant(configs.accountD, tf.privateVestingVaultInstance);
    await tf.getVestedAmount(configs.accountD, tf.privateVestingVaultInstance);

    // revoke grant after 2 days: accountD
    await tf.revokeGrant(configs.accountD, tf.privateVestingVaultInstance, configs.peInvestorsAccount);
    await tf.getGrant(configs.accountD, tf.privateVestingVaultInstance);
    await tf.getTotalVestingAmount(tf.privateVestingVaultInstance);
}

async function setup(tf) {
    await tf.checkOwners();
    await tf.transferOwner();
    await tf.lockToken();
    await tf.checkOwners();
}

async function main() {
    // init TestFrame
    const network = 'bsctestnet';
    let tf = await new TestFrame(network, configs);
    // await setup(tf);

    await teamVestingVaultTestCaseA(tf);
    await teamVestingVaultTestCaseB(tf);
    await privateVestingVaultTestC(tf);
    await privateVestingVaultTestD(tf);
}

main();