const { ethers } = require('ethers');
require('dotenv').config();

const ABI = require('../config/contractABI');

const OWNER_ADDRESS = '0xBfc92174cDE7B772d3A5B425dE01C43C8Fa58cb8';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Setting up the Provider
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`);

// Setting up the Wallet and Signer
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY);
const signer = wallet.connect(provider);

// Creating a contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

const mintNFT = async (userAddress) => {
    try {
        console.log("OWNER_ADDRESS:", OWNER_ADDRESS);
        console.log("userAddress:", userAddress);
        console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

        const txResponse = await contract.mintTo(userAddress);
        console.log("Transaction Hash:", txResponse.hash);

        // Wait for the transaction to be mined
        const receipt = await txResponse.wait();
        console.log("Transaction was mined in block:", receipt.blockNumber);

        // Extract the token ID from the event logs
        const nftMintedTopic = contract.interface.getEventTopic("TokenMinted");
        const log = receipt.logs.find(l => l.topics.includes(nftMintedTopic));

        if (log) {
            const decodedLog = contract.interface.decodeEventLog("TokenMinted", log.data, log.topics);
            console.log("Token ID:", decodedLog.tokenId);
            return decodedLog.tokenId;
        } else {
            console.error("NFTMinted event not found in logs");
            return null;
        }
    } catch (error) {
        console.error("Error in mintNFT:", error.message);
    }
};

module.exports = mintNFT;
