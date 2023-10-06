import React, { useEffect, useState } from 'react';
import { magic } from "@/lib/magic";
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Web3 from 'web3';
import { contractABI } from '../lib/abi';
import AppHeader from './AppHeader';
import QRCode from 'qrcode.react';



export default function Dashboard() {
    const router = useRouter();
    const tokenId = router.query.tokenId;
    const { user } = useUser();
    const [nftMetadata, setNftMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [address, setAddress] = useState(null);

    const checkTokenOwnership = async (address, tokenId) => {
        const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_INFURA_RPC);
        const web3 = new Web3(provider);
        const inviteContract = new web3.eth.Contract(contractABI, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
        const tokenOwner = await inviteContract.methods.ownerOf(tokenId).call();

        if (tokenOwner && address) {
            return tokenOwner.toLowerCase() === address.toLowerCase();
        } else {
            console.error("Either tokenOwner or address is undefined:", { tokenOwner, address });
            return false;
        }
    };

    useEffect(() => {
    // Get the Ethereum address from Magic and then check token ownership
    async function fetchAddressAndCheckOwnership() {
        const metadata = await magic.user.getMetadata();
        setAddress(metadata.publicAddress);

        if (metadata.publicAddress && (user?.tokenId || tokenId)) {
            // Check if the user is the owner of the token
            checkTokenOwnership(metadata.publicAddress, user?.tokenId || tokenId)
                .then(isTokenOwner => {
                    setIsOwner(isTokenOwner);
                    if (!isTokenOwner) {
                        setError('You are not the owner of this token.');
                        setLoading(false);
                        return;
                    }

                    // Fetch the NFT metadata using the token ID
                    fetchNFTMetadata(user?.tokenId || tokenId)
                        .then(data => {
                            setNftMetadata(data);
                            setLoading(false); // Metadata loaded, set loading to false
                        })
                        .catch(err => {
                            setError('Error fetching NFT metadata');
                            setLoading(false); // Metadata failed to load, set loading to false
                        });
                });
        }
    }

    fetchAddressAndCheckOwnership();
}, [user?.tokenId, tokenId]);


    const fetchNFTMetadata = async (tokenId) => {
        const API = `https://inviteapi.vercel.app/api/${tokenId}`;
        try {
            const response = await fetch(API);
            if (!response.ok) {
                throw new Error('Failed to fetch NFT metadata');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching NFT metadata:", error);
            throw error;
        }
    };

    return (
      <div className="dashboard-container">
      <AppHeader key={user?.isLoggedIn} />
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {isOwner && nftMetadata && (
            <div className="nft-display">
      <div className="nft-image-container">
      <Image src={nftMetadata.image} alt="NFT Image" width={500} height={500} priority />
      </div>

      <div className="qr-code">
            <QRCode value={nftMetadata.image} />
        </div>

      <div className="nft-details">
      <h2>{nftMetadata.name}</h2>
      <p>{nftMetadata.description}</p>
      {nftMetadata.external_url && (
        <a href={nftMetadata.external_url} target="_blank" rel="noopener noreferrer">
            External Link
        </a>
      )}
      </div>
      </div>

          )}
      </div>
    );
}
