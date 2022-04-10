import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
    },
    localhost: {
      url: 'http://localhost:8545',
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    harmony_testnet: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    aurora_mainnet: {
      url: `https://mainnet.aurora.dev`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    aurora_testnet: {
      url: `https://testnet.aurora.dev`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    bsc_testnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS}/bsc/testnet`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
