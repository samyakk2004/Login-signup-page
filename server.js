const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.listen(7000, () => {
  console.log(`Server is successfully connected on http://localhost:7000`);
});

mongoose.connect('mongodb://localhost:27017/skolarDB');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontend'));

//Routes for signup and Login
app.post('/sign_up', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json('Error: Password and Confirm Password do not match' );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('Error: User already exists' );
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(200).json('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Error: Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(401).json('Error: Invalid email or password');
    }

    if (user.password !== password) {
      console.log('Passwords do not match');
      return res.status(401).json('Error: Invalid email or password');
    }

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).json('Error: Internal Server Error');
  }
});

app.get('/home', (req, res) => {
  res.send('This is the homepage.....You have logged in successfully!');
});








