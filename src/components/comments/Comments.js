import React, {useEffect,useState} from 'react'
import './comment.css'
import axios from 'axios'
import LoadingSpinner from '../Loader/Loader';
import CommentInput from './input';
import { AiOutlineSend,AiFillDelete } from 'react-icons/ai';


const Comments = ({election}) => {
   
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user,setUser] = useState([])
    const userId = JSON.parse(localStorage.getItem("user"));
    const [open, setOpen] = useState(false);
 
    useEffect(() => {
        // Function to fetch all comments from the backend
        async function fetchAllComments() {
            
          try {
            setLoading(true)
            const response = await axios.get(`http://localhost:5000/api/v1/comments/${election._id}`);
            setComments(response.data.comments); // Assuming the response.data contains an array of comments
            setLoading(false)
        
          } catch (error) {
            // Handle any errors that occurred during the request
            setLoading(false)
            console.error('Error fetching comments:', error);
            console.log(error)
          }
        }
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:5000/api/v1/user');
              
                setUser(response.data.users); // Assuming the response.data contains an array of comments
                setLoading(false)
              
            
              } catch (error) {
                // Handle any errors that occurred during the request
                setLoading(false)
                console.error('Error fetching comments:', error);
                console.log(error)
              }
        }
    
        fetchAllComments();
        fetchUsers();
      }, []); 

      const timeAgoOrDate = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMillis = now - time;
        const diffInSeconds = diffInMillis / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;
      
        let output ;

        if (diffInDays >= 1) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const day = time.getDate();
          const month = monthNames[time.getMonth()];
          const year = time.getFullYear();
          let output = `${day} ${month} ${year}`
          return output;
        } else if (diffInHours >= 1) {
          const hours = Math.floor(diffInHours);
          output = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
          
          return output
        } else if (diffInMinutes >= 1) {
          const minutes = Math.floor(diffInMinutes);
          output = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
          return output
        } else {
          const seconds = Math.floor(diffInSeconds);
          output = `${seconds} second`
          return output
        }
        }
        const getFullName = (userId) => {
            // if(!loading && user){
            //     const foundUser = user.find((u) => u._id === userId);
            //     console.log(foundUser)
            //     return foundUser ? `${foundUser.first_name} ${foundUser.last_name}` : "Unknown User";
            // }
            if (!loading && user) {
                const foundUser = user.find((u) => u._id === userId);
                if (foundUser) {
                  const { first_name, last_name, picture } = foundUser;
                  // You can use first_name, last_name, and picture as needed
                  // This will log the picture URL
                  return { fullName: `${first_name} ${last_name}`, picture };
                }
              }
              return { fullName: "Unknown User", picture: null };

          };

          const handleCommentSubmit = async (commentText) => {
            try {
              const response = await axios.post('http://localhost:5000/api/v1/comments', {
                content: commentText,
                userId: userId._id,
                electionId:election._id
              });
              const newComment = response.data.comment; // Assuming the response contains { comment: {} }
              setComments([...comments, newComment]);
            } catch (error) {
              console.error('Error posting comment:', error);
            }
          };

          const handleToggle = () => {
            setOpen(!open);
          };

          const handleDeleteComment = async (commentId) => {
            try {
                const response  = await axios.delete(`http://localhost:5000/api/v1/comments/${commentId}`);
                console.log(response.data)
                console.log(response)
                setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
            } catch (error) {
                console.log(error)
            }
          
          };
      if(loading){
        return <LoadingSpinner/>
      }

  return (
    <div className='comment-cont'>
       <div onClick={()=>{handleToggle()}} className='comment-cont'>{`comments (${comments.length})`}</div>
       {open && <div>
       <CommentInput onCommentSubmit={handleCommentSubmit}/>
       {comments.map((comment,index)=>{
        const date = timeAgoOrDate(comment.timestamp)
        const fullName = getFullName(comment.user).fullName;
        const picture =  getFullName(comment.user).picture;
        return(
     <div className='comment-cont-general' key={index}>
       <img src={picture} className='comment-pic' alt='user-pic'/>
        <div className='comment-body'>
            <div className='comment-title'>
                <div className='comment-name'>{fullName}</div>
                <div className='comment-date'>{date}</div>
                <button className='del-btn'  onClick={() => handleDeleteComment(comment._id)}><AiFillDelete className='del-icon'/></button>
            </div>
            <div className='comment-content'>
                <p>{comment.content}</p>
            </div>

        </div>
       </div>
        )
       })}
    </div>}
       
    </div>
  )
}

export default Comments