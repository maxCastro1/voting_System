
const Comment = require('../models/Comments');

// Create a new comment
const createComment = async (req, res) => {
    try {
      const { userId, electionId, content } = req.body;
      console.log(userId)
      // Check if the userId and electionId exist and are valid in your database
      // For example, you can use Mongoose queries to validate the existence of users and elections
      // Then create a new comment
      const comment = await Comment.create({
        user: userId,
        election: electionId,
        content,
        timestamp: new Date(),
      });
      console.log('comment posted')
      res.status(201).json({ comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const deleteComment = async (req, res) => {
    try {
      const commentId = req.params.id;
      // Check if the comment exists and is valid in your database
      // For example, you can use Mongoose queries to find the comment by ID and validate its existence
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      // Check if the user has the permission to delete the comment (e.g., based on user roles)
      // For example, you can check if the user making the request is the same user who created the comment or an admin
      // Then delete the comment
      await comment.remove();
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getAllComments = async (req, res) => {
    const { id } = req.params;
    try {
      // Use the id to filter comments by the election ID
      const comments = await Comment.find({ election: id });
  
      res.status(200).json({ comments });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
  

module.exports = {deleteComment,createComment,getAllComments,}
