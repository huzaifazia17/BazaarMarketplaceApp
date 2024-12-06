const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },

  description: { 
    type: String, 
    required: true 
  },

  price: { 
    type: Number, 
    required: true 
  },

  imageUrl: { 
    type: String, 
    required: true 
  },

  location: { 
    type: String, 
    required: true 
  },

  userId: { 
    type: String, 
    required: true 
  },

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);