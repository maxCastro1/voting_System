const User = require('../models/User')
const Candidate = require('../models/Candidates')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    const imageUrl = result.url;
    // console.log(imageUrl)
    return imageUrl
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
};
const register = async (req, res) => {


    try {
      // Check if there is already a user with the same email, name or national id in the database
 
      const { email, first_name,last_name,password,admin,picture,Phone,cell } = req.body;
      const existingUser = await User.findOne({
        $or: [
          { email },
          { first_name },
        ],
      });
  
      if (existingUser) {
        return res.status(400).json({
          error: "A user with the same email, name or national id already exists",
        });
      }
      // const imageUrl = await uploadImage(picture)
      // Create the new user if no existing user was found
      const user = await User.create({
        first_name,
        last_name,
        email,
        password,
        admin,
        picture,
        phone:Phone,
        cell
      });

      const token = user.createJWT();
      res.status(200).json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
  
      const isPasswordCorrect = await user.comparePassword(password);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
  
      const token = user.createJWT();
  
      // Check if the user is also a candidate
    const candidate = await Candidate.findOne({ userId: user._id });
    console.log(candidate)
      return res.status(200).json({ user, token, candidate });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    register,
    login
  }