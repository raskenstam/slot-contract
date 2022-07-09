const { Contract, getAccountByName } = require("secret-polar");
const { Wallet, SecretNetworkClient } = require("secretjs");
async function run() {
  const contract_owner = getAccountByName("account_0");
  const contract = new Contract("sample-project");
  const wallet = new Wallet(contract_owner.account.mnemonic);
  let codeId = parseInt(contract.env.config.networks.default.codeId);
  console.log(codeId);
  myAddress = wallet.address;
  secretjs = await SecretNetworkClient.create({
    chainId: contract.env.config.networks.default.chainId,
    grpcWebUrl: contract.env.config.networks.default.endpoint,
    wallet: wallet,
    walletAddress: myAddress,
  });
  let codeHash = await secretjs.query.compute.codeHash(codeId);
  const tx1 = await secretjs.tx.compute.instantiateContract(
    {
      sender: myAddress,
      codeId: codeId,
      codeHash: codeHash, // optional but way faster
      initMsg: {
        entropy: 69,
        win_table: [
          10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
          170, 180, 190, 200,
        ],
        buyin: 250,
      },
      label: "secretsloth2: " + codeId,
      initFunds: [
        {
          denom: "uscrt",
          amount: "69000",
        },
      ],
    },
    {
      gasLimit: 1000000,
    }
  );
  console.log(tx1);
}

module.exports = { default: run };
