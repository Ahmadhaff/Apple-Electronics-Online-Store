const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Check if the product already exists in the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // If the user's cart doesn't exist, create a new cart
      cart = new Cart({ user: userId, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      // If the product already exists in the user's cart, update the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // If the product doesn't exist in the user's cart, add it to the cart
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      cart.products.push({ product: product._id, quantity });
    }

    // Save the cart to the database
    await cart.save();

    res.json({ message : 'Product added successfully', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Remove a product from the cart
const removeFromCart = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
  
      // Find the user's cart and remove the product with the specified ID
      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { _id: id } } },
        { new: true }
      );
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.json({ message:'product removed successfully ',cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Update the quantity of a product in the cart
const updateCartItemQuantity = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.user._id;
  
      // Find the user's cart and update the quantity of the product with the specified ID
      const cart = await Cart.findOneAndUpdate(
        { user: userId, 'products._id': id },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      );
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.json({message:'Quantity updated successfully', cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Clear the entire cart
const clearCart = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Find the user's cart and remove all products
      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { products: [] } },
        { new: true }
      );
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.json({message:'cart has been cleared', cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get all items in the cart
const getCartItems = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId }).populate('products.product');
      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const checkout = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId }).populate('products.product');
      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
    
      const { paymentMethod, shippingAddress, cardNumber, cvv } = req.body;
      if (!paymentMethod || !shippingAddress || !cardNumber || !cvv) {
        return res.status(400).json({ error: 'Payment method, shipping address, card number, and CVV are required' });
      }
    
      const order = new Order({
        user: userId,
        paymentMethod,
        shippingAddress,
        cardNumber,
        cvv,
        products: cart.products.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalPrice: cart.products.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0),
      });
    
      await order.save();
      await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [] } });
    
      res.json({ message: 'Checkout successful, order created', order });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  
module.exports = {addToCart,removeFromCart,updateCartItemQuantity,clearCart,getCartItems,checkout};