const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Joi = require('../models/joiModel');





const register = async (req, res) => {
  try {
    const { error, value } = Joi.validate(req.body, Joi.userSchema);
    if (error) {
      return res.status(400).json({ message: "Invalid user input. " + error.details[0].message });
    }
    const { name, email, password } = value;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();


    res.status(200).json({ message: 'User has been registered successfully' });
  } catch (error) {
    res.status(400).json({ message: `Error Occurred while registering the user: ${error}` });
  }
}




const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Retrieve user data
    const userData = await getUserData(user._id);

    // Redirect user based on their role
    if (user.role === 'admin') {
      res.status(201).json({ message: 'Login success as admin', token, userData, redirect: '/admin/dashboard' });
    } else {
      res.status(201).json({ message: 'Login success', token, userData, redirect: '/' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getUserData = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    console.log('User data retrieved:', user);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw new Error('Internal server error');
  }
};



  
  const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (user) {
        user.name = req.body.name || user.name;
  
        if (req.body.email) {
          // Check if the new email already exists in the database
          const emailExists = await User.findOne({ email: req.body.email });
          if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          user.email = req.body.email;
        }
  
        if (req.body.password) {
          user.password = await bcrypt.hash(req.body.password, 10);
        }
  
        const updatedUser = await user.save();
        const token = jwt.sign({ userId: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
        res.status(200).json({ message: 'User updated successfully', updatedUser, token });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
   

  const deleteAccount = async (req, res) => {
    try {
      // Find the user by ID and delete them from the database
      await User.findByIdAndDelete(req.user.id);
  
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };  
  
  const logout = async (req, res) => {
    try {
      // Simulate an asynchronous operation
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      // Clear the JWT token from the client-side
      res.clearCookie('token');
  
      // Send a response indicating successful logout
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      // Handle any errors that occurred during the logout process
      res.status(500).json({ message: 'Error during logout' });
    }
  };
  
  
  



module.exports = { register ,  login , getUserData, updateUserProfile,deleteAccount,logout} ;
