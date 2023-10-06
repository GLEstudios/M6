// frontend/__mocks__/Web3Context.tsx
import React from 'react';

export const useWeb3 = jest.fn().mockReturnValue({
  web3: {},
  initializeWeb3: jest.fn(),
  contract: {},
  isAccountChanged: false,
  isWeb3Initialized: true,
  OWNER_ADDRESS: '0x1234',
});

export const Web3Provider: React.FC = ({ children }) => <>{children}</>;
