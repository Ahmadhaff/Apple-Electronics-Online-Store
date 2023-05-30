const Order = require('../models/orderModel');

// Function to create a new order
const createOrder = async (req, res) => {
  try {
    const cart = req.user.cart;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }
    const orderItems = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));
    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice: req.user.cartTotalPrice,
    });
    await order.save();
    // Clear cart
    req.user.cart = [];
    req.user.cartTotalPrice = 0;
    await req.user.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to get an order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to update an order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to delete an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to search orders by status
const searchOrderByStatus = async (req, res) => {
  const { status } = req.query;
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;

  try {
    let orders;
    if (isAdmin) {
      orders = await Order.find({ status });
    } else {
      orders = await Order.find({ user: userId, status });
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ message: 'Orders found', orders });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  searchOrderByStatus,
};
