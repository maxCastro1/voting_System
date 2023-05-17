const Vote = require('../models/Vote');

const registerVote = async (req, res) => {
    const { user_id, candidate_id, election_id } = req.body;
  
    try {
      const vote = new Vote({
        user: user_id,
        candidate: candidate_id,
        election: election_id,
      });
  
      await vote.save();
  
      res.status(200).json({
        message: 'Vote registered successfully!',
        vote: {
          _id: vote._id,
          user: vote.user,
          candidate: vote.candidate,
          election: vote.election,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Failed to register vote',
        error: error.message,
      });
    }
  };

  const getAllVotes = async (req, res) => {
    try {
      const votes = await Vote.find({})
        .populate('user', 'first_name last_name')
        .populate('candidate', 'first_name last_name')
        .populate('election', 'name');
  
      res.status(200).json(votes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  const getAllVotesByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const votes = await Vote.find({ user: userId }).populate('user').populate('candidate').populate('election');
      res.status(200).json({ success: true, votes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  const hasUserVotedInElection = async (req,res) => {
    const {userId, electionId } = req.body
    try {
      const vote = await Vote.findOne({ user: userId, election: electionId });
      res.status(200).send(vote !== null) 
    } catch (error) {
      console.log(error);
      return false;
    }
  }

 
  module.exports = {
    registerVote,
    getAllVotes,
    getAllVotesByUser,
    hasUserVotedInElection
  }

