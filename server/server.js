const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.DB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected Successfully')
})
.catch((error) => {
    console.log('Error connecting MongoDB',error.message)
})

app.use('/api' , require('./routes/userRoutes'));
app.use('/api' , require('./routes/productRoutes'));
app.use('/api' , require('./routes/categoryRoutes'));
app.use('/api' , require('./routes/orderRoutes'));
app.use('/api' , require('./routes/cartRoutes'));



const port = process.env.PORT || 5000;
app.listen(port , () => console.log(`listening on port ${port}`));





