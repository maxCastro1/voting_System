const express = require('express')
const router = express.Router()
const { createElection, getAllElection,addCandidateToElection,deleteElection,updateElection,updateElectionStatus } = require('../controllers/Election');


router.post('/create', createElection);
router.post('/addCandidate/:id', addCandidateToElection);
router.get('/', getAllElection);
router.post('/delete/:electionId', deleteElection);
router.post('/update/:id', updateElection);
router.post('/:id', updateElectionStatus);

module.exports = router
