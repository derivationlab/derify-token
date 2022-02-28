/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

var HDWalletProvider = require("@truffle/hdwallet-provider");
var wrapProvider = require('arb-ethers-web3-bridge').wrapProvider;
const configs = require('./configs');
var privateKey = configs.privateKeyDeployAccount;
var infuraId = configs.infuraId;

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     networkCheckTimeout: 500000,
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },

    kovan: {
      networkCheckTimeout: 10000000,
      timeoutBlocks: 200,
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: "https://kovan.infura.io/v3/" + infuraId,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/",
          pollingInterval: 30000
        }),
      gas: 12000000,
      gasPrice: 10000000000,
      network_id: 42,
      skipDryRun: true
    },

    ropsten: {
      networkCheckTimeout: 1000000,
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: "https://ropsten.infura.io/v3/" + infuraId,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/",
          pollingInterval: 180000
        }),
      gas: 8000000,
      gasPrice: 20000000000,
      network_id: 3,
      skipDryRun: true
    },

    rinkeby: {
      networkCheckTimeout: 80000000,
      timeoutBlocks: 1200,
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: configs.rinkebyWssUrl + infuraId,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/",
          pollingInterval: 360000
        }),
      gas: 10000000,
      gasPrice: 5000000000,
      network_id: 4,
      skipDryRun: true
    },

    arbitrumtestnet: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://rinkeby.arbitrum.io/rpc',
        pollingInterval: 720000
      }),
      network_id: 421611,
      confirmations: 2,
      networkCheckTimeout: 80000000,
      timeoutBlocks: 1200,
      skipDryRun: true,
      gasPrice: 1000000000,
    },

    live: {
      networkCheckTimeout: 10000000,
      timeoutBlocks: 200,
      provider: () =>
        new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: "https://mainnet.infura.io/v3/" + infuraId,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/",
          pollingInterval: 240000
        }),
      gas: 8000000,
      gasPrice: 30000000000,
      network_id: 1,
      skipDryRun: true
    },

    bsc: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://bsc-dataseed.binance.org',
        pollingInterval: 720000
      }),
      network_id: 56,
      networkCheckTimeout: 80000000,
      timeoutBlocks: 1200,
      skipDryRun: true,
      gas: 10000000,
      gasPrice: 50000000000,  //5 gwei
    },

    bsctestnet: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        pollingInterval: 720000
      }),
      network_id: 97,
      confirmations: 2,
      networkCheckTimeout: 80000000,
      timeoutBlocks: 1200,
      skipDryRun: true
    },
    // xDai live
    xDai: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://xdai.poanetwork.dev',  // 'wss://rpc.xdaichain.com/wss'
        pollingInterval: 720000
      }), 
      network_id: 100,
      confirmations: 2,
      gas: 10000000,  //17000000
      gasPrice: 1000000000,
      skipDryRun: true
    },
    // poa sokol for xDai testnet
    sokol: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://sokol.poa.network',
        pollingInterval: 360000
      }),
      network_id: 77,
      gasPrice: 1000000000
    },
    //Polygon test
    mumbaitestnet: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://rpc-mumbai.maticvigil.com',
        pollingInterval: 720000
      }),
      network_id: 80001,
      confirmations: 2,
      networkCheckTimeout: 80000000,
      timeoutBlocks: 1200,
      skipDryRun: true
    },
    //Polygon live
    matic: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey], 
        providerOrUrl: 'https://rpc-mainnet.matic.network',
        pollingInterval: 720000
      }),
      network_id: 137,
      confirmations: 2,
      networkCheckTimeout: 80000000,
      timeoutBlocks: 1200,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
       evmVersion: "istanbul"
      }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  },

  plugins: ["truffle-contract-size"]
};
