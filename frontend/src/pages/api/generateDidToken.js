//frontend/src/pages/api/generateDidToken.js
import { Magic } from 'magic-sdk';

const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);

export default async (req, res) => {
  try {
    const didToken = await magic.auth.loginWithCredential();
    res.status(200).json({ didToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
