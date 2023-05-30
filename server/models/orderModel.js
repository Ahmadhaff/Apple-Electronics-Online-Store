const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered'],
    default: 'Pending'
  },
  shippingAddress: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending'
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

module.exports = mongoose.model('Order', orderSchema);
