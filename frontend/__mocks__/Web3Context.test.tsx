import React from 'react';
import { render } from '@testing-library/react';
import Web3Provider, { useWeb3 } from './Web3Context';

// Mock the magic library
jest.mock('../lib/magic');

const TestComponent: React.FC = () => {
  const { web3, isWeb3Initialized } = useWeb3();

  return (
    <div>
      {isWeb3Initialized ? 'Initialized' : 'Not Initialized'}
    </div>
  );
};

describe('Web3Context', () => {
  it('should initialize Web3', () => {
    const { getByText } = render(
      <Web3Provider>
        <TestComponent />
      </Web3Provider>
    );

    expect(getByText('Initialized')).toBeInTheDocument();
  });

  // Add more tests as needed
});
