const Candidate = require('../models/Candidates');
const Vote = require('../models/Vote');
const Election = require('../models/Election');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');


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

const createCandidate = async (req, res) => {
  try {
    const { email, first_name, last_name, description,picture } = req.body;
    const existingUser = await Candidate.findOne({
      $or: [
        { email },
        { first_name, last_name },
      ],
    });
    if (existingUser) {
      return res.status(400).json({
        error: "A user with the same email or name already exists",
      });
    }

    
   const imageUrl = await uploadImage(picture)
    const candidate = await Candidate.create({
      email,
      first_name,
      last_name,
      description,
      picture: imageUrl,
    });

    res.status(200).json({ candidate });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};





const getAllCandidate = async (req, res) => {
  
    const candidates = await Candidate.find({});
    // const firstNames = candidates.map((candidate) => candidate.first_name);
    res.status(200).json({ candidates});
  }

  const getCandidateById = async (req, res) => {
    
    try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      return res.status(200).json({ candidate });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  

  const addVoteToCandidate = async (req, res) => {
    try {
      const { candidateId } = req.params;
      const { userId, electionId } = req.body;
  
      // Check if the candidate exists
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
  
      // Check if the user already voted for this candidate in this election
      const existingVote = await Vote.findOne({
        user: userId,
        candidate: candidateId,
        election: electionId
      });
      if (existingVote) {
        return res.status(400).json({ error: 'User already voted for this candidate in this election' });
      }
  
      // Create a new vote document
      const newVote = new Vote({
        user: userId,
        candidate: candidateId,
        election: electionId
      });
  
      // Save the new vote document to the database
      await newVote.save();
  
      // Add the new vote to the candidate's votes array
      candidate.votes.push({ user: userId, vote_id: newVote._id });
      await candidate.save();
  
      return res.status(200).json({ message: 'Vote added to candidate successfully', voteId: newVote._id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  const deleteCandidate = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the candidate to be deleted
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
  
      // Find the election the candidate is in
      // const election = await Election.findById(id);
      // const election = await Election.find({ candidates: mongoose.Types.ObjectId(id) });
      const election = await Election.find({'candidates.candidate': id });
      if (election.length > 0 ) {
     
           // Check if the candidate is not the only one in the election]
         
        //  if (election[0].candidates.length === 1) {
        //     return res.status(400).json({ error: 'Cannot delete the only candidate in the election' });
        //   }
        // // Remove the candidate from the election's candidates array
        // election.candidates = election[0].candidates.filter((c) => c != id);
  
        for (let i = 0; i < election.length; i++) {
          const candidates = election[i].candidates;
          if (candidates.length === 1) {
            return res.status(400).json({ error: 'Cannot delete the only candidate in the election' });
          }
          election[i].candidates = candidates.filter((c) => c.candidate != id);
          await election[i].save();
        }
      }
      // Delete the candidate from the Candidate collection
      await Candidate.findByIdAndDelete(id);
  
      // Delete all votes associated with the candidate
      await Vote.deleteMany({ candidate: id });
  
      return res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

// Update function
const updateCandidate = async (req,res) => {

  const {id} = req.params
  const {first_name, last_name, email, description, picture} = req.body
  try {
    // Find the candidate by ID
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      // Handle case where candidate is not found
      throw new Error('Candidate not found');
    }

    // Update fields if provided
    if (first_name) {
      candidate.first_name = first_name;
    }

    if (last_name) {
      candidate.last_name = last_name;
    }

    if (email) {
      candidate.email = email;
    }

    if (description) {
      candidate.description = description;
    }

    if (picture) {
      candidate.picture = picture;
    }

    // Save the updated candidate
    await candidate.save();
    console.log(candidate)
    // Return the updated candidate object
    res.status(200).send({candidate})
  } catch (error) {
    console.log(error)
    // Handle any errors that occur during the update process
    throw new Error('Failed to update candidate: ' + error.message);
  }
};

module.exports = {
    createCandidate,
    getAllCandidate,uploadImage,getCandidateById,addVoteToCandidate,deleteCandidate,updateCandidate
  }






































    // Use multer to handle file upload
   // Use multer to handle file upload
  //  upload.single('picture')(req, res)
  //  .then(() => {
  //    const candidate = new Candidate({
  //      email,
  //      first_name,
  //      last_name,
  //      description,
  //      picture: {
  //        data: req.file.buffer,
  //        contentType: req.file.mimetype,
  //      },
  //    });
  //    return candidate.save();
  //  })
  //  .then(candidate => {
  //    res.status(200).json({ candidate });
  //  })
  //  .catch(error => {
  //    console.log(error);
  //    res.status(500).json({ error: "Internal server error" });
  //  });
