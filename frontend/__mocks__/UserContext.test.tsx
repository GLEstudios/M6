import React from 'react';
import { render } from '@testing-library/react';
import UserProvider, { useUser } from './UserContext';

// Mock the Web3Context
jest.mock('./Web3Context');

const TestComponent: React.FC = () => {
  const { user, error } = useUser();

  return (
    <div>
      {error ? `Error: ${error}` : user?.loading ? 'Loading' : 'Loaded'}
    </div>
  );
};

describe('UserContext', () => {
  it('should initialize user data', () => {
    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(getByText('Loading')).toBeInTheDocument();
  });

  // Add more tests as needed, for example:
  // - Test if user data is fetched correctly
  // - Test if errors are handled and displayed correctly
  // - Test any other functionalities provided by the UserContext
});
