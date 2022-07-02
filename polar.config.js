const accounts = [
  {
    name: 'account_0',
    address: 'secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03',
    mnemonic: 'grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar'
  },
  {
    name: 'account_1',
    address: 'secret1fc3fzy78ttp0lwuujw7e52rhspxn8uj52zfyne',
    mnemonic: 'jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow'
  }
];
const networks = {
  localnet: {
    endpoint: 'http://localhost:1317/',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
        amount: [{ amount: "500000", denom: "uscrt" }],
        gas: "2000000",
      },
      init: {
        amount: [{ amount: "125000", denom: "uscrt" }],
        gas: "500000",
      },
    }
  },
  // Pulsar-2
  testnet: {
    endpoint: 'http://localhost:1317/',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
        amount: [{ amount: "500000", denom: "uscrt" }],
        gas: "2000000",
      },
      init: {
        amount: [{ amount: "125000", denom: "uscrt" }],
        gas: "500000",
      },
    }
  },
  development: {
    endpoint: 'http://localhost:1317/',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
        amount: [{ amount: "500000", denom: "uscrt" }],
        gas: "2000000",
      },
      init: {
        amount: [{ amount: "125000", denom: "uscrt" }],
        gas: "500000",
      },
    }
  },
  // Supernova Testnet
  supernova: {
    endpoint: 'http://localhost:1317/',
    accounts: accounts,
    types: {},
    fees: {
      upload: {
        amount: [{ amount: "500000", denom: "uscrt" }],
        gas: "2000000",
      },
      init: {
        amount: [{ amount: "125000", denom: "uscrt" }],
        gas: "500000",
      },
    }
  }
};

module.exports = {
  networks: {
    default: networks.testnet,
    localnet: networks.localnet,
    development: networks.development
  },
  mocha: {
    timeout: 60000
  },
  rust: {
    version: "1.55.0",
  }
};
