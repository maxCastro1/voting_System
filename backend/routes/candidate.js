const express = require('express')
const router = express.Router()


const { createCandidate, getAllCandidate,uploadImage,getCandidateById,addVoteToCandidate,deleteCandidate,updateCandidate   } = require('../controllers/Candidate')
router.post('/create', createCandidate)
router.post('/image', uploadImage )
router.get('/', getAllCandidate)
router.get('/:id', getCandidateById)
router.post('/vote/:candidateId', addVoteToCandidate)
router.post('/delete/:id', deleteCandidate )
router.post('/update/:id', updateCandidate )

module.exports = router
