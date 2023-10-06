import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enterprise: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  attending: {
    type: Boolean,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  nftTokenId: {
    type: Number,
    required: true,
    unique: true,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
