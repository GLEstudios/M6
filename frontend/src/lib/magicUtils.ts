import { magic } from './magic';
import { OAuthExtension } from '@magic-ext/auth'; // Import the OAuthExtension module
import { getUserData } from './utils';

interface MagicLoginProps {
    setUser: Function;
    initializeWeb3: Function;
    web3: any;
    emailAddress: string;
}

export const handleMagicLogin = async ({ setUser, initializeWeb3, web3, emailAddress }: MagicLoginProps) => {
    try {
        const didToken = await magic.auth.loginWithMagicLink({ email: emailAddress });
        if (!didToken) {
            throw new Error("Authentication failed.");
        }

        const userInfo = await magic.user.getInfo();
        const magicAddress = userInfo.publicAddress;

        if (!magicAddress) {
            throw new Error("Failed to retrieve Ethereum address.");
        }

        const userData = { email: emailAddress, isLoggedIn: true, publicAddress: magicAddress };
        setUser(userData);
        await initializeWeb3();

      /*  const additionalUserData = await getUserData(web3, userData);*/
        // Handle the fetched data here, if necessary

    } catch (error) {
        console.error('An error occurred during Magic login:', error.message);
    }
};
