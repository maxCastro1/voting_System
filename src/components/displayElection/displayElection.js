import React ,{useState, useEffect} from 'react'
import Candidate from '../candidateView/Candidate';
import axios from 'axios';
import {HiBadgeCheck} from "react-icons/hi";
const DisplayElection = ({election,hoursLeft}) => {

     const [hasVoted, setHasVoted] = useState(false); 
     const user = JSON.parse(localStorage.getItem('user'));
     useEffect(() => {
       axios.post(`http://localhost:5000/api/v1/vote/userCheck`,{
        userId:user._id,
        electionId:election._id
      })
          .then(response => {
            setHasVoted(response.data); 
            // Set hasVoted to true if the user has voted
          })
          .catch(error => {
            console.log(error);
          });
      }, []);

  return (
    <div className='elections-cont' >  
        <div className='elections-cont-title'>
        <h2>Position : <u>{election.name}</u></h2>
        <h2 id='time'>{hoursLeft}</h2>
        </div>
        <h5>Description</h5>
        <p>{election.description}</p>
        {hasVoted && <p id='voting-msg'>Congratulations you have voted <HiBadgeCheck/> </p> }
    <div className='elections-cont-body'>
       {election.candidates.map((candidate,index)=>{
          return(
            <Candidate candidates={candidate} electionId={election._id} key={index} hasVoted={hasVoted}/>
          )
       })}
    </div>
    </div>
  )
}

export default DisplayElection