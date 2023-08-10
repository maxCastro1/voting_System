const Election = require('../models/Election');
const Notification = require('../models/notification');
const Candidate = require('../models/Candidates')
// Route to create a new election

// Get notifications for a specific user
// const getNotifications = async (req, res) => {

//   try {
//     const userId = req.params.userId;
//     const userCandidates = await Candidate.find({ userId }); 
//     if(!userCandidates){
//       return res.status(200).json({message:'no notification'})
//     }
//     const user = userCandidates.userId
//     // Assuming you pass the user's ID as a URL parameter
//     const notifications = await Notification.find({ user });
//     res.json({notifications});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find candidates associated with the user
    const userCandidates = await Candidate.find({ userId });
    
    if (!userCandidates || userCandidates.length === 0) {
      return res.status(200).json({ message: 'No notifications' });
    }
    console.log(userCandidates[0]._id)
    // Extract user IDs from the found candidates
    // const userCandidateIds = userCandidates.map(candidate => candidate.userId);
    
    // Find notifications associated with the user's candidates
    const notifications = await Notification.find({ userId: { $in: userCandidates[0]._id } });
    
    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update the accepted field of a notification
const updateAcceptance = async (req, res) => {
  try {
    // const notificationId = req.params.notificationId;
  const accepted = req.body.accepted;
   const notificationId = req.body.notificationId;

   if(!notificationId) {
    return res.status(404).json({ message: 'notification not found' });
   }
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: { answered: true } },
      { new: true }
    );

    if (accepted) {
      // If accepted is true, set the winner in the election to the candidate
      const { electionId } = req.body; // Assuming you pass candidateId and electionId in the request body
      
      const election = await Election.findById(electionId);
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
      const candidateId = election.pending[0].candidate
      if(!candidateId){
        console.log('no candidate')
      }
      // Set the winner in the election to the candidate

      election.winners = [candidateId];
      election.pending[0].answer = false;
      await election.save();
      const updatedNotification2 = await Notification.findByIdAndUpdate(notificationId, { accepted: true }, { new: true });
    } else {
      // If accepted is false, set the election failed to true and set pending to false
      const { electionId } = req.body; // Assuming you pass electionId in the request body

      const election = await Election.findById(electionId);
      if (!election) {
        return res.status(404).json({ message: 'Election not found' });
      }
     
      election.failed = true;
      election.pending[0].answer = false;
      await election.save();
    }

    res.json({message: 'well done'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId; // Assuming you pass the notification's ID as a URL parameter
    await Notification.findByIdAndDelete(notificationId);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    const notification = new Notification({
      userId,
      message,
    });
    
    await notification.save();
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};


module.exports = {
  getNotifications,
  updateAcceptance,
  deleteNotification,
  createNotification
};