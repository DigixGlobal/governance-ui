import dgd from '@digix/governance-ui-components/node_modules/@digix/dao-contracts/build/contracts/MockDgd.json';


const contracts = {
  dgd,
};

export function getContract(name, DEFAULT_NETWORKS, network) {
  const contract = contracts[name];
  let latestNetwork = Math.max(...Object.keys(contract.networks));
  const selectedNetwork = DEFAULT_NETWORKS.find(n => n.id.toLowerCase() === network.toLowerCase());

  if (selectedNetwork.id.toLowerCase() !== 'testrpc') {
    latestNetwork = selectedNetwork.chainId;
  }
  return {
    abi: contract.abi,
    address: contract.networks[latestNetwork]
      ? contract.networks[latestNetwork].address
      : '0x0000000000000000000000000000000000000001',
  };
}
