import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Web3 from "web3";
import { magic } from "../lib/magic";

type Web3ContextType = {
  web3: Web3 | null;
  initializeWeb3: () => Promise<void>;
  isAccountChanged: boolean;
  isWeb3Initialized: boolean;
};

const Web3Context = createContext<Web3ContextType>({
  web3: null,
  initializeWeb3: async () => {},
  isAccountChanged: false,
  isWeb3Initialized: false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [isAccountChanged, setIsAccountChanged] = useState<boolean>(false);
  const [isWeb3Initialized, setIsWeb3Initialized] = useState<boolean>(false);

  const initializeWeb3 = useCallback(async () => {
    try {
      const provider = await magic.wallet.getProvider();
      const web3Instance = new Web3(provider);

      provider.on("accountsChanged", async () => {
        setIsAccountChanged((state) => !state);
      });

      provider.on("chainChanged", async () => {
        const chainId = await web3Instance.eth.getChainId();
        const sepoliaChainId = 11155111;
        if (chainId !== sepoliaChainId) {
          alert("Please switch to the Sepolia network");
        }
      });

      setWeb3(web3Instance);
      setIsWeb3Initialized(true);
    } catch (error) {
      console.error("Failed to initialize web3", error);
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        initializeWeb3,
        isAccountChanged,
        isWeb3Initialized,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
