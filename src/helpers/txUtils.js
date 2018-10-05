export default function sanitizeData(txData, network) {
  return {
    to: txData.to,
    from: txData.from,
    gas: txData.gas || txData.gasLimit,
    gasPrice: txData.gasPrice,
    value: txData.value || '0x00',
    data: txData.data || '',
    nonce: txData.nonce,
    chainId: (txData.chainId && parseInt(txData.chainId, 10)) || (network.chainId && parseInt(network.chainId, 10)),
  };
}
