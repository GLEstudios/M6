import { useEffect, useState } from "react";
import Image from "next/image";

interface CollectibleCardProps {
  tokenURI?: string;
}

interface Metadata {
  description?: string;  // Using description as the name of the NFT
  image?: string;
  tokenId?: string;
}

export default function CollectibleCard({ tokenURI }: CollectibleCardProps) {
  let [metadata, setMetadata] = useState<Metadata>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (uri: string) => {
    try {
      setLoading(true);
      const response = await fetch(uri);
      const data = await response.json();
      setMetadata(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setError("Failed to fetch metadata.");
      setLoading(false);
    }
  };

  // Auto fetch the token's metadata
  useEffect(() => {
    // If tokenURI is defined, fetch the metadata from the tokenURI
    if (tokenURI) {
      fetchMetadata(tokenURI);
    }
  }, [tokenURI]);

  if (loading) return <div>Loading...</div>;

  // Error state
  if (error) return <div>{error}</div>;

  // No image in metadata
  if (!metadata?.image) return null;

  return (
    <div className="mx-auto overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-brand">
      {metadata?.description && (
        <div className="w-full bg-white bg-opacity-80 px-4 py-2 font-semibold">
          {metadata.description}  {/* Using description as the name of the NFT */}
        </div>
      )}
      <Image
        src={metadata.image}
        width={256}
        height={256}
        alt="Event Collectible NFT"
      />
      {metadata?.tokenId && (
        <div className="w-full bg-white bg-opacity-80 px-4 py-2 text-sm">
          Token ID: {metadata.tokenId}
        </div>
      )}
    </div>
  );
}
