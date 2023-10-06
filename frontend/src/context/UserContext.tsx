import { useState, useEffect, createContext, useContext } from "react";
import { magic } from '../lib/magic';
import { OAuthExtension } from '@magic-ext/auth'; // Import the OAuthExtension module



// Define custom user data type
interface UserData {
  address?: string;
  shortAddress?: string;
  balance?: string;
  collectibles?: string[];
  isLoggedIn?: boolean;
  loading?: boolean;
  tokenId?: string;
  publicAddress?: string;
  email?: string;
}

// Define user context type
type UserContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | undefined>> | null;
  error: string | null;
  handleLogin: () => Promise<void>;
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: null,
  error: null,
  handleLogin: async () => {},
});

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component to wrap around components that need access to the context
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData>();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const didToken = await magic.auth.loginWithMagicLink({ email: user?.email });
      if (didToken) {
        const userInfo = await magic.user.getInfo();
        setUser({
          ...user,
          isLoggedIn: true,
          publicAddress: userInfo.publicAddress,
          email: userInfo.email,
        });
      } else {
        setError("Failed to authenticate with Magic.");
      }
    } catch (err) {
      setError(`Error during login: ${err.message}`);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, error, handleLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
