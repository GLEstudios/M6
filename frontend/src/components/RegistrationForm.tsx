import React, { useState } from 'react';
import { magic } from '../lib/magic';
import { OAuthExtension } from '@magic-ext/auth';
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { AnimatedLoader } from './AnimatedLoader';
import BlurredModal from './BlurredModal'; // Import the modal component


export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [enterprise, setEnterprise] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const { user, setUser } = useUser();
  const router = useRouter();

  const isEmailRegistered = async (email) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/isEmailRegistered`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to check email registration');
      }

      const data = await response.json();
      return data.isRegistered;
    } catch (error) {
      console.error("Error checking email registration:", error);
      return false;
    }
  };

  const handleRegistration = async () => {
      setError(null);
      setIsRegistering(true);

      if (!name || !enterprise || !email || !phone || !attendance) {
          setError('Please fill out all the fields.');
          setIsRegistering(false);
          return;
      }

      if (attendance !== 'yes') {
          setError('You must indicate that you are attending the event to get access.');
          setIsRegistering(false);
          return;
      }

      const emailRegistered = await isEmailRegistered(email);
      if (emailRegistered) {
          setError('This email is already registered. Please sign in.');
          setIsRegistering(false);
          return;
      }

      try {
          const didToken = await magic.auth.loginWithMagicLink({ email });
          if (didToken) {
              const userInfo = await magic.user.getInfo();
              const magicAddress = userInfo.publicAddress;

              if (!magicAddress) {
                  throw new Error("Failed to retrieve Ethereum address.");
              }

              setShowModal(true);
              console.log("showModal state:", showModal);

              const response = await fetch(`http://localhost:5001/api/users/register`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      address: magicAddress,
                      email: email,
                      name: name,
                      enterprise: enterprise,
                      phone: phone,
                      nft: ""  // Placeholder for NFT tokenId, will be updated once minted
                  }),
                  credentials: 'include'
              });

              const data = await response.json();
              if (!data.success) {
                  throw new Error(data.message || "Failed to register.");
              }

              // After successful registration, fetch the token ID
              const tokenIdResponse = await fetch(`http://localhost:5001/api/users/getTokenId`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: email }), // Use the email to fetch the token ID
              });

              const tokenIdData = await tokenIdResponse.json();
              if (tokenIdData.success && tokenIdData.tokenId) {
                  // Set the token ID in the state or context
                  setUser({ ...user, tokenId: tokenIdData.tokenId });
              } else {
                  throw new Error(tokenIdData.message || "Failed to fetch token ID.");
              }

              // Redirect the user to the dashboard
              console.log("Navigating to /dashboard");
              router.push('/dashboard').then(() => {
                  console.log("Navigation complete");
              }).catch(error => console.error(error));
          }
      } catch (error) {
          setShowModal(false); // Ensure the modal is hidden in case of an error
          console.error("Registration Error:", error.message);
          setError('An error occurred. Please try again.');
      }
  };

  const validateForm = () => {
    // Name validation
    if (!/^[a-zA-Z\s'-]{2,50}$/.test(name)) {
      alert('Invalid name format.');
      return false;
    }

    // Enterprise validation
    if (!/^[a-zA-Z0-9\s.,'-]{2,100}$/.test(enterprise)) {
      alert('Invalid enterprise format.');
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email.toLowerCase())) {
      alert('Invalid email format.');
      return false;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return false;
    }

    // Attendance validation
    if (attendance !== 'yes' && attendance !== 'no') {
      alert('Please indicate if you are attending the event.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // If validations pass, proceed with the registration logic
    await handleRegistration();
  };

  return (
    <div className="mx-auto w-3/4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="block w-full p-2 mb-4 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enterprise"
          className="block w-full p-2 mb-4 border rounded-md"
          value={enterprise}
          onChange={(e) => setEnterprise(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-2 mb-4 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          className="block w-full p-2 mb-4 border rounded-md"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="flex items-center justify-between mb-4">
          <p>Are you coming to the event?</p>
          <div>
            <label className="mr-4">
              <input
                type="radio"
                name="attendance"
                value="yes"
                className="mr-2"
                checked={attendance === 'yes'}
                onChange={() => setAttendance('yes')}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="attendance"
                value="no"
                className="mr-2"
                checked={attendance === 'no'}
                onChange={() => setAttendance('no')}
              />
              No
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || isRegistering}
          className="btn w-full p-4 custom-blue-500 text-white rounded-md"
        >
          {isRegistering ? <AnimatedLoader /> : loading ? "Processing..." : "Get Your Access"}
        </button>
      </form>
      {error && <p>{error}</p>}
      <BlurredModal
    message="Registration in process, please standby..."
    visible={showModal}
/>
    </div>
  );
}
