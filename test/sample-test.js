var assert = require("assert");
const {
  Wallet,
  SecretNetworkClient,
  MsgSend,
  MsgMultiSend,
} = require("secretjs");
const fs = require("fs");
describe("contracts", async function () {
  let contractAddress;
  let codeHash;
  let secretjs;
  let myAddress;
  async function setup() {
    let memonic =
      "grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar";
    const wallet = new Wallet(memonic);
    myAddress = wallet.address;
    secretjs = await SecretNetworkClient.create({
      chainId: "secretdev-1",
      grpcWebUrl: "http://localhost:9091",
      wallet: wallet,
      walletAddress: myAddress,
    });
    //upload contract
    const tx = await secretjs.tx.compute.storeCode(
      {
        sender: myAddress,
        wasmByteCode: fs.readFileSync(
          `/home/stenasd3/slot-contract/artifacts/contracts/sample_project.wasm`
        ),
        source: "",
        builder: "",
      },
      {
        gasLimit: 2000000,
      }
    );
    const codeId = Number(
      tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
        .value
    );
    console.log("codeid:" + codeId);
    codeHash = await secretjs.query.compute.codeHash(codeId);
    const tx1 = await secretjs.tx.compute.instantiateContract(
      {
        sender: myAddress,
        codeId: 44,
        codeHash: codeHash, // optional but way faster
        initMsg: {
          entropy: 69,
          win_table: [
            10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
            160, 170, 180, 190, 200,
          ],
          buyin: 250,
        },
        label: "ass" + codeId,
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
    contractAddress = tx1.arrayLog.find(
      (log) => log.type === "message" && log.key === "contract_address"
    ).value;
  }
  before(() => {
    return setup();
  });
  it("roll", async () => {
    console.log(contractAddress);
    console.log(codeHash);
    let tx = await secretjs.tx.compute.executeContract(
      {
        sender: myAddress,
        contractAddress: contractAddress,
        codeHash: codeHash,
        msg: {
          start_slot: {
            entropy: 69,
          },
        },
        sentFunds: [
          {
            denom: "uscrt",
            amount: "242",
          },
        ],
      },
      {
        gasLimit: 100_000,
      }
    );
    assert(tx.arrayLog == undefined);
  }),
    it("roll2", async () => {
      let tx = await secretjs.tx.compute.executeContract(
        {
          sender: myAddress,
          contractAddress: contractAddress,
          codeHash: codeHash,
          msg: {
            start_slot: {
              entropy: 69,
            },
          },
          sentFunds: [
            {
              denom: "uscrt",
              amount: "250",
            },
          ],
        },
        {
          gasLimit: 100_000,
        }
      );
      const result = tx.arrayLog.filter((elm) => elm.type == "transfer");
      assert(result);
    }),
    it("win_table", async () => {
      let quary = await secretjs.query.compute.queryContract({
        contractAddress: contractAddress,
        codeHash: codeHash,
        query: { get_win_table: {} },
      });
      assert(quary.win_table && quary.buyin == 250);
    }),
    it("roll2", async () => {
      let tx0 = await secretjs.tx.compute.executeContract(
        {
          sender: myAddress,
          contractAddress: contractAddress,
          codeHash: codeHash,
          msg: {
            start_slot: {
              entropy: 69,
            },
          },
          sentFunds: [
            {
              denom: "uscrt",
              amount: "250",
            },
          ],
        },
        {
          gasLimit: 100_000,
        }
      );
      let tx = await secretjs.tx.compute.executeContract(
        {
          sender: myAddress,
          contractAddress: contractAddress,
          codeHash: codeHash,
          msg: {
            terminate: {},
          },
          sentFunds: [],
        },
        {
          gasLimit: 100_000,
        }
      );
      assert(tx.arrayLog[0]);
    });
});
