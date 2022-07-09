const { Wallet, SecretNetworkClient } = require("secretjs");
const { Contract, getAccountByName, getLogs } = require("secret-polar");
const fs = require("fs");
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
  const tx = await secretjs.tx.compute.storeCode(
    {
      sender: myAddress,
      wasmByteCode: fs.readFileSync(contract.contractPath),
      source: "",
      builder: "",
    },
    {
      gasLimit: 2000000,
    }
  );
  console.log(tx);
}

module.exports = { default: run };
