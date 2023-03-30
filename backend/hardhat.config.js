require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.9",
  networks:{
    goerli:{
      url: 'https://eth-goerli.g.alchemy.com/v2/ykNx0Yycb7C2hbM4nZhTtjDVfcsZP-z_',
      accounts: ['69a2a06f50a7042654c20ca5294eed887c928d647cea6016dff77fa698a40a5a']
    }
  }
}