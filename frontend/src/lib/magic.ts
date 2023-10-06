import { Magic } from "magic-sdk";
require('dotenv').config();


// Initialize the Magic instance
const createMagic = () => {
  return (
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      locale: 'es',
      /*testMode: true,*/
      network: {
        rpcUrl: process.env.NEXT_PUBLIC_INFURA_RPC, /*"http://localhost:5001/sepolia"*/
        chainId: 11155111,
      },
    })
  );
};

export const magic = createMagic();


/* rpcUrl: 'https://polygon-rpc.com/', // or https://matic-mumbai.chainstacklabs.com for testnet
        chainId: 137 // or 80001 for polygon testnet*/
