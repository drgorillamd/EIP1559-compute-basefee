const ethers = require('ethers');
const fs = require('fs');

async function baseFeeTheo (provider)  {
    const BASE_FEE_MAX_CHANGE_DENOMINATOR = 8;
    const ELASTICITY_MULTIPLIER = 2;
    try {
            const __ = await provider.getBlock(provider.blockNumber);
            const newBlock = provider.blockNumber;
            const content = await provider.getBlock(newBlock);

            const parent_gas_target = Math.floor(content.gasLimit / ELASTICITY_MULTIPLIER);
            const parent_gas_used = Math.floor(content.gasUsed);
            const parent_gas_basefee = Math.floor(content.baseFeePerGas);

            if(parent_gas_target == parent_gas_used) return [newBlock+1, ethers.BigNumber.from(parent_gas_basefee)];

            if(parent_gas_used > parent_gas_target) {
                const delta = parent_gas_used - parent_gas_target;
                const baseFeePerGasDelta = Math.max(Math.floor(Math.floor((parent_gas_basefee * delta) / parent_gas_target) / BASE_FEE_MAX_CHANGE_DENOMINATOR), 1);
                const newBaseFee = parent_gas_basefee+baseFeePerGasDelta;
                return [newBlock+1, ethers.BigNumber.from(newBaseFee)];
            }

            if(parent_gas_used < parent_gas_target) {
                const delta = parent_gas_target - parent_gas_used;
                const baseFeePerGasDelta = Math.floor(Math.floor((parent_gas_basefee * delta) / parent_gas_target) / BASE_FEE_MAX_CHANGE_DENOMINATOR);
                const newBaseFee = parent_gas_basefee - baseFeePerGasDelta;
                return [newBlock+1, ethers.BigNumber.from(newBaseFee)];
            }

    } catch (e) {
        console.log(e);
        return 0;
    }
}

module.exports = baseFeeTheo;

    /*

        EIP 1559 :
        '//' is integer division round down

        BASE_FEE_MAX_CHANGE_DENOMINATOR = 8;
        ELASTICITY_MULTIPLIER = 2

		parent_gas_target = self.parent(block).gas_limit // ELASTICITY_MULTIPLIER
        parent_gas_limit = self.parent(block).gas_limit

		elif parent_gas_used == parent_gas_target:
			expected_base_fee_per_gas = parent_base_fee_per_gas

		elif parent_gas_used > parent_gas_target:
			gas_used_delta = parent_gas_used - parent_gas_target
			base_fee_per_gas_delta = max(parent_base_fee_per_gas * gas_used_delta // parent_gas_target // BASE_FEE_MAX_CHANGE_DENOMINATOR, 1)
			expected_base_fee_per_gas = parent_base_fee_per_gas + base_fee_per_gas_delta
      
		else:
			gas_used_delta = parent_gas_target - parent_gas_used
			base_fee_per_gas_delta = parent_base_fee_per_gas * gas_used_delta // parent_gas_target // BASE_FEE_MAX_CHANGE_DENOMINATOR
			expected_base_fee_per_gas = parent_base_fee_per_gas - base_fee_per_gas_delta
    */