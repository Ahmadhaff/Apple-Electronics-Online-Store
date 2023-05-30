const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
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
  quantity: {
    type: Number,
   
    
  },
  category: {
    type: String,
    
  },
  image: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
