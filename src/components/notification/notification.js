import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../Loader/Loader';
import './notification.css';
const Notification = () => {
    // const { searchValue } = useParams();
    // const [searchInput, setSearchInput] = useState('');
    // const [searchData, setSearchData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [answer, setAnswer] = useState(null);
   

    const name = 'nasara';
    const position = 'president';
    const time = '5h ago';

    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
  
    useEffect(() => {
      if (user) {
        setLoading(true)
        axios.post(`http://localhost:5000/api/v1/notification/${user._id}`)
          .then(response => {
            setNotifications(response.data.notifications);
            console.log(response.data)
            setLoading(false)
          })
          .catch(error => {
            console.error(error);
            setLoading(false)
          });
      }
    }, []);

    if (loading) {
        return <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #0F5298" padding='2rem' />
    }
    if (error) {
        return <h1>Something went wrong, please try again.</h1>
    }
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

        const handleClick = async (answer,electionId,notificationId) => {
            try {
                setLoading(true)
                const response = await axios.post('http://localhost:5000/api/v1/notification/', {
                    accepted:answer,
                    electionId,
                    notificationId

                })
               console.log(response.data)
               console.log('ok')
                setLoading(false)
                window.location.reload();
              
            
              } catch (error) {
                // Handle any errors that occurred during the request
            
                console.error('Error fetching comments:', error);
                console.log(error)
                setLoading(false)
              }
        }
    
    return (
        <div className='notification-main'>
            <h1>Your notifications </h1>
            {!loading && notifications.length === 0 && <p>No Notification at the time</p> }
            {notifications.map((notification,index)=>{
                return(
                    <div className={ !notification.accepted && notification.answered ? 'notification-cont false' : 'notification-cont'} key={index}>
                    <div>
                        <div className='notification-title'><p>{`hello ${user.first_name}  `} </p> <span>{timeAgoOrDate(notification.createdAt)}</span></div>
                      {!notification.answered && <p>{`You have been selected for ${notification.position}`} </p>}
                       {!notification.accepted && notification.answered && <p>{`You have declined the position of ${notification.position}`} </p>}
                       {notification.accepted && notification.answered && <p>{`You have Acepted the position of ${notification.position}`} </p>}
    
    
                        { !notification.answered  && <div className='notification-button'>
    
                            <button className='accept-button' onClick={()=>{handleClick(true,notification.electionId, notification._id)}}>Accept</button>
                            <button className='decline-button' onClick={()=>{handleClick(false,notification.electionId, notification._id)}}>Decline</button>
                        </div>}
    
                    </div>
                </div>
                )
            })}
       
        </div>
    )
}

export default Notification