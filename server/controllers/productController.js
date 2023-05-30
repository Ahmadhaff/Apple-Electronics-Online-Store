const Product = require('../models/productModel');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get a single product by ID
const getProductById = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product found.', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Create a new product
const createProduct = async (req, res) => {
    const { name, price, description, image } = req.body;
  
    try {
      const product = new Product({
        name,
        price,
        description,
        image,
      });
  
      await product.save();
  
      res.status(201).json({ message: 'Product created successfully.', product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// Update an existing product by ID
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, price, description, image } = req.body;
  
    try {
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
  
      await product.save();
  
      res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const deleteProduct = async (req, res) => {
    const id = req.params.id;
  
    try {
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      await product.deleteOne();
  
      res.status(200).json({ message: 'Product deleted successfully.', product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
 
  // search Product by name , category and sort 
  const productSearch = async (req, res) => {
    const { name, category, minPrice, maxPrice, sort } = req.query;
  
    const filter = {};
  
    // Add filters to the filter object
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) {
      if (!filter.price) filter.price = {};
      filter.price.$lte = maxPrice;
    }
  
    const sortCriteria = {};
if (sort === 'priceAsc') sortCriteria.price = -1;
if (sort === 'priceDesc') sortCriteria.price = 1;
  
    try {
      const products = await Product.find(filter).sort(sortCriteria);
      if (!products) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ success: true, products });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  




module.exports = {getProducts , getProductById , createProduct , updateProduct,deleteProduct,productSearch};
