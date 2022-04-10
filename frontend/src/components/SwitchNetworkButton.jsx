function SwtichNetworkButton() {
    async function clicked() {
        if (window.ethereum) {
            try {
                // check if the chain to connect to is installed
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
                });
            } catch (error) {
                // This error code indicates that the chain has not been added to MetaMask
                // if it is not, then install it into the user MetaMask
                if (error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x89',
                                    chainName: "Polygon Mainnet",
                                    rpcUrls: ['https://polygon-rpc.com/'],
                                    nativeCurrency: {
                                        name: "Matic",
                                        symbol: "MATIC",
                                        decimals: 18
                                    },
                                    blockExplorerUrls: ["https://polygonscan.com/"]
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error(addError);
                    }
                }
                console.error(error);
            }
        }
    }

    return <button onClick={clicked}>Switch Network</button>
}

export default SwtichNetworkButton;