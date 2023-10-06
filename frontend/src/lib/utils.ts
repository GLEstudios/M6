export async function getUserData(web3, contract, initializeWeb3) {
  if (!web3 || !web3.eth) {
    web3 = await initializeWeb3();
    if (!web3) {
      throw new Error("Web3 or web3.eth is not initialized even after trying to initialize");
    }
  }

  try {
    console.log("Fetching user data...");

    // Get the user's address
    const [address] = await web3.eth.getAccounts();

    // Truncate the user's address for display purposes
    const shortAddress = `${address.substring(0, 5)}...${address.substring(
      address.length - 4,
    )}`;

    return {
      isLoggedIn: true,
      loading: false,
      address,
      shortAddress,
    /*  collectibles: undefined,
      refreshCollectibles: true,*/
    };
  } catch (error) {
    console.error("getUserData", error);
    console.log('web3:', web3);
  }
}

/*export async function fetchNFTs(address, web3, contract) {
  if (!web3) {
    throw new Error("Web3 is not initialized");
  }

  console.log("web3 instance before contract initialization:", web3);

  try {
    const tokenBalanceBigInt = await contract.methods.balanceOf(address).call();
    const tokenBalance = Number(tokenBalanceBigInt.toString());
    console.log(`Total NFTs owned: ${tokenBalance}`);

    const tokens = await Promise.all(
      Array.from({ length: tokenBalance }, async (_, i) => {
        try {
          const tokenId = await contract.methods
            .tokenOfOwnerByIndex(address, i)
            .call();
          const uri = await contract.methods.tokenURI(tokenId).call();
          return ipfsToHttps(uri);
        } catch (err) {
          console.warn(`Error fetching token at index ${i}:`, err);
          return null;
        }
      }),
    );

    const validTokens = tokens.filter(Boolean);
    console.log("Total NFTs found:", validTokens.length);

    return validTokens;
  } catch (err) {
    console.error(`Error fetching NFTs:`, err);
    return false;
  }
}


export async function fetchJSONfromURI(url) {
  return fetch(ipfsToHttps(url))
    .then((res) => res?.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
}

export function ipfsToHttps(uri) {
  uri = uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/").toString();
  return uri;
}*/
