const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { 
    type: String, 
    required: true, 
    unique: true 
  },

  firstName: { 
    type: String, 
    required: true 
  },

  lastName: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true 
  },

  city: { 
    type: String, 
    required: true 
  },

  province: { 
    type: String, 
    required: true 
  },

  phoneNumber: { 
    type: String, 
    required: true 
  },
  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);