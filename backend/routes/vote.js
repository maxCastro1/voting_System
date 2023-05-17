const express = require('express')
const router = express.Router()
const { registerVote,
    getAllVotes,
    getAllVotesByUser,hasUserVotedInElection } = require('../controllers/vote');


router.post('/register', registerVote);
router.get('/', getAllVotes);
router.get('/:userId', getAllVotesByUser);
router.post('/userCheck', hasUserVotedInElection);

module.exports = router
