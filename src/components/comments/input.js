import React, { useState,useEffect } from 'react';
import { AiOutlineSend } from 'react-icons/ai';

const CommentInput = ({ onCommentSubmit }) => {
  const [commentText, setCommentText] = useState('');

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = () => {
    onCommentSubmit(commentText);
    setCommentText(''); // Clear the input field after submission
  };

  return (
    <div className='comment-input'>
      <textarea
      rows="1"
        type="text"
        value={commentText}
        onChange={handleInputChange}
        placeholder="Write your comment..."
      />
      <button onClick={handleSubmit}><AiOutlineSend/></button>
    </div>
  );
};

export default CommentInput;
