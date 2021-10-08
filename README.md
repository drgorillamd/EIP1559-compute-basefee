# EIP1559: compute basefee

JS implementation of the calculation of expected_base_fee_per_gas in EIP-1559 (https://github.com/ethereum/EIPs/blob/6153495c90a556947f381956cfa64d07b241c6e1/EIPS/eip-1559.md), based on last mined block gas data.

# Usage

const baseFeeTheo = require('./baseFeeTheo.js')
const ethers = require('ethers');

const provider = new ethers.providers.getDefaultProvider();
const [block, estim] = await baseFeeTheo(provider);
