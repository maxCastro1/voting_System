const Election = require('../models/Election');
const Candidate = require('../models/Candidates');
const Vote = require('../models/Vote');
const Candidates = require('../models/Candidates');
const Notification = require('../models/notification')

const createElection = async (req, res) => {
  try {
    const { name, type , description,end_time,candidates } = req.body;
    // Check if an election with the same name already exists
    const existingElection = await Election.findOne({ name });
    if (existingElection) {
      return res.status(400).json({
        error: "An election with the same name already exists",
      });
    }

    // Create the election based on whether the 'type' field is provided or not
    let election;
    if (type) {
      // If 'type' is provided, set the 'typeAdministrative' field accordingly
      election = await Election.create({ name, typeAdministrative: true, description, end_time , candidates: candidates.map(candidateId => ({candidate:candidateId}))});
    } else {
      // If 'type' is not provided, set the 'typeAdministrative' field to false (default value)
      election = await Election.create({ name, description, end_time, candidates: candidates.map(candidateId => ({candidate:candidateId}))});
    }

    res.status(200).json({ election });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const createNotification = async (userId, message,position,electionId) => {
  try {
    const notification = new Notification({
      userId,
      message,
      position,
      electionId
    });
    
    await notification.save();
    
    return notification;
  } catch (error) {
    // Handle the error if needed
    throw new Error('Error creating notification');
  }
};

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
  try {
    // Use the sort method to sort the elections by the 'end_time' field in ascending order
    const elections = await Election.find({}).sort({ end_time: 1 });
    res.status(200).json({ elections });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  }

  const deleteElection = async (req, res) => {
    try {
      const { electionId } = req.params;
  
      // Delete votes associated with the election from the Vote collection
      await Vote.deleteMany({ election: electionId });
  
      // Remove the election from the candidates' votes array in the Candidate collection
      const candidates = await Candidate.find({ election: electionId });
      for (const candidate of candidates) {
        candidate.votes = candidate.votes.filter((vote) => vote.election !== electionId);
        await candidate.save();
      }
  
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

const updateElectionStatus = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  try {
    const election = await Election.findById(id).populate('candidates.candidate');

    if (!election) {
      return res.status(500).json({ error: 'No election found' });
    }

    if (election.typeAdministrative) {
      const candidatesWithVotes = election.candidates.filter(candidate => candidate.candidate.votes.length > 0);
      const atLeastSevenCandidatesHaveVotes = candidatesWithVotes.length >= 7;

      if (!atLeastSevenCandidatesHaveVotes) {
        election.finished = true;
        election.failed = true;
      } else {
        const candidatesWithMostVotes = election.candidates
          .sort((a, b) => b.candidate.votes.length - a.candidate.votes.length)
          .slice(0, 7);

        const adminCandidateIds = candidatesWithMostVotes.map(candidate => candidate.candidate._id);
        await Candidate.updateMany({ _id: { $in: adminCandidateIds } }, { $set: { admin: true } });
        await Candidate.updateMany({ _id: { $nin: adminCandidateIds } }, { $set: { admin: false } });

        election.winners = candidatesWithMostVotes.map(candidate => candidate.candidate);
        election.finished = true;
      }
    } else {
      if (election.pending.length > 0 ) {
        if (answer === true) {
          election.winners = [election.pending.candidate];
          election.pending[0].answer = false; 
          
        } else if(answer === false){
          election.failed = true;
          election.pending[0].answer = false; 
        } else {
        }
        
      } else {
        const candidatesWithMostVotes = election.candidates
          .map(candidate => {
            return {
              candidate: candidate.candidate._id,
              votes: candidate.candidate.votes.filter(vote => vote.election_id.toString() === id),
            };
          })
          .sort((a, b) => b.votes.length - a.votes.length);

        if (candidatesWithMostVotes.length === 0 || candidatesWithMostVotes[0].votes.length === 0) {
          election.failed = true;
        } else if (
          candidatesWithMostVotes.length > 1 &&
          candidatesWithMostVotes[0].votes.length === candidatesWithMostVotes[1].votes.length
        ) {
          election.failed = true;
        } else {
          election.pending.push({
            candidate: candidatesWithMostVotes[0].candidate,
            answer: true
          }); 
          try {
            const notification = await createNotification(
              election.pending[0].candidate,
              'You have won the election.',
               election.name,
               election._id
            );
    
            // Handle notification creation success
            console.log('Notification created:', notification);
          } catch (error) {
            // Handle notification creation error
            console.error('Notification creation error:', error);
          }

        }
      }

      election.finished = true;
    }

    await election.save();
    const message = election.failed ? 'Election status update failed' : 'Election status updated successfully';
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = {
    createElection,
    getAllElection,
    addCandidateToElection,deleteElection,updateElection,updateElectionStatus
  }