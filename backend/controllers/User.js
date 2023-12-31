const User = require('../models/User')
const Vote = require('../models/Vote'); // Import the Vote model
const Candidate = require('../models/Candidates'); // Import the Candidate model
const Election = require('../models/Election')
const mongoose = require('mongoose');
const Comment = require('../models/Comments')
// Function to fetch all users
const getAllUsers = async (req, res) => {
    try {
      // Use the find() method on the User model to fetch all users
      const users = await User.find();
      res.status(200).send({users});
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  };



// Function to delete a user by _id
const deleteUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      // Convert userId to mongoose.Types.ObjectId
      const objectId = mongoose.Types.ObjectId(userId);
  
      // Use the findByIdAndRemove() method on the User model to delete the user
      const deletedUser = await User.findByIdAndRemove(objectId);
  
      if (!deletedUser) {
        throw new Error('User not found'); // Throw an error if user is not found
      }
  
      // Delete all votes associated with the user from the Vote model
      await Vote.deleteMany({ user: objectId });
      await Comment.deleteMany({ user: objectId });
  
      // Update the votes array of all candidates to remove the user
      await Candidate.updateMany({ votes: objectId }, { $pull: { votes: objectId } });
  
      res.status(200).send({ deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  };

  const search = async (req, res) => {
    const searchTerm = req.body.searchTerm; // Get search term from request body
    // Convert the search term to lowercase for case-insensitive search
  
    const searchTermLower = searchTerm.toLowerCase();
    const candidates = await Candidate.find();
    const elections = await Election.find();
    const users = await User.find();
    try {
      // // Search through candidates
      // const matchedCandidates = candidates.filter(candidate => {
      //   // Combine candidate's first name and last name for search
      //   const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
      //   // Check if candidate's full name or other relevant properties match the search term
      //   return fullName.includes(searchTermLower) ||
      //          candidate.description.toLowerCase().includes(searchTermLower) 
      // });
  
      // Search through elections
      const matchedElections = elections.filter(election => {
        // Check if election's name or other relevant properties match the search term
        return election.name.toLowerCase().includes(searchTermLower) ||
               election.description.toLowerCase().includes(searchTermLower) 
      });
  
      // Search through users
      const matchedUsers = users.filter(user => {
        // Check if user's name or other relevant properties match the search term
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const phoneString = user.phone ? user.phone.toString() : ''; // Convert user.phone to a string or set to empty string if not available
        const cellString = user.cell ? user.cell.toString() : ''; // Convert user.cell to a string or set to empty string if not available
      
        return fullName.toLowerCase().includes(searchTermLower) ||
               (user.phone && phoneString.includes(searchTermLower)) ||
               (user.cell && cellString.includes(searchTermLower)) ||
               user.email.toLowerCase().includes(searchTermLower);
      });
      
      
  
      // Return the matched candidates, elections, and users as search results
      // candidates: matchedCandidates,
      const searchResults = {  elections: matchedElections, users: matchedUsers };
  
      // Send the search results as response
      res.status(200).json(searchResults);
    } catch (error) {
      // Handle any errors that may occur during search
      console.log(error)
      res.status(500).json({ error: "Failed to perform search" });
    }
  };
  
  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, picture } = req.body;
    try {
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        // Handle case where user is not found
        throw new Error('User not found');
      }
  
      // Update fields if provided
      if (first_name) {
        user.first_name = first_name;
      }
  
      if (last_name) {
        user.last_name = last_name;
      }
  
      if (email) {
        user.email = email;
      }

      // Save the updated user
      await user.save();
      // Return the updated user object
      res.status(200).send({ user });
    } catch (error) {
      console.log(error);
      // Handle any errors that occur during the update process
      throw new Error('Failed to update user: ' + error.message);
    }
  };
  const getUserById = async (req, res) => {
    const userId = req.params.id; // Assuming you pass the user's ID as a URL parameter
    try {
      // Use the findById() method on the User model to fetch the user by ID
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getUserByIds = async (req, res) => {
    const userIds = req.body.userIds; // Assuming you pass an array of user IDs in the request body
    try {
      // Use the find() method on the User model to fetch users by their IDs
      const users = await User.find({ _id: { $in: userIds } });
  
      if (users.length !== userIds.length) {
        // Some user IDs were not found
        const foundUserIds = users.map(user => user._id.toString());
        const notFoundUserIds = userIds.filter(id => !foundUserIds.includes(id));
        return res.status(404).json({ message: `Users with IDs [${notFoundUserIds.join(', ')}] not found` });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {getAllUsers,deleteUserById,search,updateUser,getUserById,getUserByIds  };