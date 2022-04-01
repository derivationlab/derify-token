# derify-token

Token contracts of Derify protocol.

## Audit Report

- Certik Project Link: [Derify Protocol](https://www.certik.com/projects/derify-protocol)
- Certik Report: [audit.pdf](https://github.com/derivationlab/derify-token/blob/main/audits/certik/audit.pdf)

## Development

### Dependencies
```
npm install
```

### Run test
```
npm run test ./test
```

### Compiling
```
npm run compile
```

### Migrating with Ganache
1. Install and Launch [Ganache](https://www.trufflesuite.com/ganache) locally.

2. Config truffle-config.js with the network of Canache's connection parameters.

3. Migrate the contract to the blockchain created by Ganache.

```
npm run deploy
```
