import { useWeb3 } from "@/context/Web3Context";
import { magic } from "@/lib/magic";
import { OAuthExtension } from '@magic-ext/auth'; // Import the OAuthExtension module
import { useUser } from "@/context/UserContext";
import { useState } from 'react';
import { useRouter } from 'next/router';
import BlurredModal from './BlurredModal'; // Import the modal component
require('dotenv').config();


export default function LoginWithMagic() {
  const router = useRouter(); // Moved this outside the function for global use
  const { initializeWeb3 } = useWeb3();
  const { user, setUser } = useUser();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [tokenId, setTokenId] = useState('');

  /*const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;*/

  const isEmailRegistered = async (email) => {
    try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/users/isEmailRegistered`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setLoading(false);
        return data.isRegistered;
    } catch (error) {
        console.error("Error checking email registration:", error);
        setLoading(false);
        return false;
    }
  };

  const handleLogin = async () => {
    setError(null);
    console.log("Attempting to log in with Magic...");

    const userEmail = prompt("Please enter your email address:");
    console.log("Sending email to backend:", userEmail);


    if (userEmail === null) {
      console.log("User canceled the prompt.");
      return;
    }

    if (!userEmail.trim()) {
      setError('Email is required.');
      return;
    }

    const isRegistered = await isEmailRegistered(userEmail);
    if (!isRegistered) {
      setError('This email is not registered. Please register first.');
      return;
    }

    try {
      const didToken = await magic.auth.loginWithMagicLink({ email: userEmail });

      if (didToken) {
        const userInfo = await magic.user.getInfo();
        const magicAddress = userInfo.publicAddress;
        /*setIsModalActive(true);*/

        if (!magicAddress) {
          throw new Error("Failed to retrieve Ethereum address.");
        }


        // Fetch the user's token ID
        const response = await fetch(`http://localhost:5001/api/users/getTokenId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await response.json();
        console.log("Response from backend:", data);

        if (data.success && data.tokenId) {
              console.log("Setting token ID in state:", data.tokenId);

          setTokenId(data.tokenId);
          // Display the modal with the message
          setIsModalActive(true);
          console.log("Received Token ID from backend:", data.tokenId);

          router.push(`/dashboard?tokenId=${data.tokenId}`);
        } else {
          throw new Error(data.message || "Failed to fetch token ID.");
        }
      } else {
        setError('Failed to authenticate with Magic.');
      }
    } catch (error) {
      setIsModalActive(false);
      console.error("handleLogin", error);
      setError('An error occurred during login.');
    }
  };

  const handleLogout = async () => {
    try {
      await magic.user.logout(); // <-- Use this instead of magic.wallet.logout()
      setUser(null);
    } catch (error) {
      console.error("handleLogout", error);
    }
  };

  const handleCloseMagicModal = () => {
    magic.user.logout();
    setIsModalActive(false);
  };

  return (
    <div>
      {user && user.isLoggedIn ? (
        <button onClick={handleLogout} className="btn inline-flex space-x-3 text-lg">
          <span>Sign out ({user.publicAddress.slice(0, 6)}...{user.publicAddress.slice(-4)})</span>
        </button>
      ) : (
        <button onClick={handleLogin} className="btn inline-flex space-x-3 text-lg">
          {loading ? "Checking email..." : "Sign in"}
        </button>
      )}
      {error && <div className="error-message">{error}</div>}
      {isModalActive && (
        <button onClick={handleCloseMagicModal}>Close Magic Modal</button>
      )}
      {isModalActive && (
        <BlurredModal
          message="Redirecting to dashboard..."
          visible={isModalActive}
        />
      )}
    </div>
  );
}
