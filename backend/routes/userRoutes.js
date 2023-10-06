const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const mintNFT = require('../utils/nftMinter');

// Check if the provided email is registered
router.post('/isEmailRegistered', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            res.json({ isRegistered: true });
        } else {
            res.json({ isRegistered: false });
        }
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// User registration, including NFT minting and database update
router.post('/register', async (req, res) => {
    console.log("Received a request to /register");
    const { address, email, name, enterprise, phone } = req.body;

    if (!address || !email || !name || !enterprise || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user with the provided email already exists
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
            return res.status(400).json({ message: 'Email address is already registered. Please sign in.' });
        }

        // Check if the email is in the whitelist
        const isEmailWhitelisted = process.env.WHITELISTED_EMAILS.includes(email);
        if (!isEmailWhitelisted) {
            return res.status(403).json({ message: 'User is not whitelisted' });
        }

        // User is whitelisted, proceed with registration
        const user = new User({ address, nft: 'NFT_PENDING', email, name, enterprise, phone });

        // Update the "registered" field to true
        user.registered = true;

        await user.save();

        // Mint NFT for the user using their address
        const tokenId = await mintNFT(address);
        // Update the user's record in the database
        try {
          const user = await User.findOne({ address });

          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
          }

          user.nft = tokenId;
          await user.save();
          console.log("Minted Token ID:", tokenId);

          res.status(200).json({ success: true, message: 'NFT tokenId updated successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    } catch (error) { // Add this catch block
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/getTokenId', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, tokenId: user.nft });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    // Create a new user in the database
    const newUser = new User({
        address: req.body.address,
        email: req.body.email,
        name: req.body.name,
        enterprise: req.body.enterprise,
        phone: req.body.phone,
        nft: tokenId
    });

    await newUser.save();

    // Return the tokenId in the response
    res.json({ success: true, tokenId: user.nft });
});

router.post('/updateNft', async (req, res) => {
    const { email, nft } = req.body;

    if (!email || !nft) {
        return res.status(400).json({ message: 'Email and NFT tokenId are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.nft = nft;
        await user.save();

        res.status(200).json({ success: true, message: "NFT tokenId updated successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/dashboard', async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ message: 'address is required' });
    }

    try {
        const user = await User.findOne({ address });
        if (user) {
            res.json({
                address: user.address,
                nft: user.nft
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/*router.post('/register', async (req, res) => {
    const { address, email, name, enterprise, phone } = req.body;

    if (!address || !email || !name || !enterprise || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ address });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this address already exists' });
        }
        // Check if user with the provided email already exists
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
            return res.status(400).json({ message: 'Email address is already registered. Please sign in.' });
        }

        const user = new User({ address, nft: 'NFT_PENDING', email, name, enterprise, phone });
        await user.save();

        const tokenId = await mintNFT(address); // Modify mintNFT to return the token ID

        // Update the user's NFT token ID in the database
        user.nft = tokenId;
        await user.save();

        res.status(201).json({ message: 'User registered and NFT minted successfully' });
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.email) {
                res.status(400).json({ message: 'Email is already in use' });
            } else {
                res.status(400).json({ message: 'User with this address already exists' });
            }
        } else {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
});*/




router.post('/api/users/login', async (req, res) => {
    // ... your login logic ...

    // After authenticating the user
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.json({ success: true, tokenId: user.nft });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});

router.post('/checkAndMint', async (req, res) => {
    const { email } = req.body; // or const { publicAddress } = req.body;

    // Check if user is registered
    let user = await User.findOne({ email }); // or User.findOne({ address: publicAddress });

    if (!user) {
        // Register user and mint NFT
        user = new User({ /* user details */ });
        const tokenId = await mintNFT(/* parameters */);
        user.nft = tokenId;
        await user.save();

        // Send token ID back to frontend
        res.json({ success: true, tokenId: user.nft });
    } else {
        res.json({ success: false, message: 'User not registered' });
    }
});



module.exports = router;
