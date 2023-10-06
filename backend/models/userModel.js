const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  enterprise: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  registered: {
   type: Boolean,
   default: false, // Initialize as false
 },
 nft: {
   type: String,
   required: true,
 },
});

const User = mongoose.model('User', userSchema, 'INV.users');
module.exports = User;
