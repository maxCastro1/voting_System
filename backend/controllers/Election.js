const Election = require('../models/Election');
const Candidate = require('../models/Candidates');
const Vote = require('../models/Vote');

const createElection = async (req, res) => {
 
    try {
        const { name} = req.body;
        const existingUser = await Election.findOne({ name });
          if (existingUser) {
            return res.status(400).json({
              error: "An election with the same name already exists",
            });
          }
          const election = await Election.create(req.body);
          res.status(200).json({election});
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
   
      

}
const addCandidateToElection = async (req, res) => {

    try {
        const electionId = req.params.id;
        const candidateId = req.body.candidate_id;
  
      const election = await Election.findById(electionId);
  
      if (!election) {
        return res.status(404).json({ msg: 'Election not found' });
      }
  
      const existingCandidate = election.candidates.find(
        (candidate) => candidate.candidate.toString() === candidateId
      );
  
      if (existingCandidate) {
        return res.status(400).json({ msg: 'Candidate already added to election' });
      }
  
      election.candidates.push({ candidate: candidateId });
      await election.save();
  
      res.status(200).json({ msg: 'Candidate added to election successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
const getAllElection = async (req, res) => {
    const election = await Election.find({});
    res.status(200).json({election});
  }

  const deleteElection = async (req, res) => {
    try {
      const { electionId } = req.params;
  
      // Delete votes associated with the election from the Vote collection
      await Vote.deleteMany({ election: electionId });
  
      // Remove the election from the candidates' votes array in the Candidate collection
      const candidates = await Candidate.find({ election: electionId });
      candidates.forEach(async (candidate) => {
        candidate.votes = candidate.votes.filter((vote) => vote.election !== electionId);
        await candidate.save();
      });
  
      // Delete the election from the Election collection
      await Election.findByIdAndDelete(electionId);
  
      res.status(200).json({ message: 'Election deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Update function
const updateElection = async (req,res) => {
  const {id} = req.params
  const { name, description, endTime} = req.body
  try {
    // Find the election by ID
    const election = await Election.findById(id);

    if (!election) {
      // Handle case where election is not found
      throw new Error('Election not found');
    }

    // Update fields if provided
    if (name) {
      election.name = name;
    }

    if (description) {
      election.description = description;
    }

    if (endTime) {
      election.end_time = endTime;
    }

    // Save the updated election
    await election.save();

    // Return the updated election object
    res.status(200).send({election})
  } catch (error) {
    // Handle any errors that occur during the update process
    throw new Error('Failed to update election: ' + error.message);
  }
};

module.exports = {
    createElection,
    getAllElection,
    addCandidateToElection,deleteElection,updateElection
  }