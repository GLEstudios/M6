import { magic } from '../lib/magic';
import { OAuthExtension } from '@magic-ext/auth'; // Import the OAuthExtension module
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';

function SignIn() {
    const { user, setUser } = useUser();
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const didToken = await magic.auth.loginWithMagicLink({ email: user.email });
            if (didToken) {
                const userInfo = await magic.user.getInfo();
                const magicAddress = userInfo.publicAddress;

                if (!magicAddress) {
                    throw new Error("Failed to retrieve Ethereum address.");
                }

                setUser({ ...user, isLoggedIn: true, publicAddress: magicAddress });
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    return (
        <div>
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
}

export default SignIn;
