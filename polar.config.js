const accounts = [
  {
    name: "account_0",
    address: "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
    mnemonic:
      "grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar",
  },
];

module.exports = {
  networks: {
    default: {
      endpoint: "https://grpc.pulsar.scrttestnet.com",
      chainId: "pulsar-2",
      trustNode: true,
      keyringBackend: "test",
      accounts: accounts,
      types: {},
      codeId: 1,
    },
    /*
    development: {
      endpoint: "http://localhost:9091",
      chainId: "secretdev-1",
      keyringBackend: "test",
      accounts: accounts,
      types: {},
      codeId: 1,
    },*/
    // Holodeck Testnet
    testnet: {
      endpoint: "http://bootstrap.secrettestnet.io:26657",
      chainId: "holodeck-2",
      trustNode: true,
      keyringBackend: "test",
      accounts: accounts,
      types: {},
      codeId: 10274,
    },
  },
  mocha: {
    timeout: 60000,
  },
};
