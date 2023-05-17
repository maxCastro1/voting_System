import React, { useState, useEffect } from 'react'
import Candidate from '../candidateView/Candidate'
import axios from 'axios';
import DisplayElection from '../displayElection/displayElection';
import Winner from '../displayElectionWInner/winner';
import Calculate from '../calculateElection.js/calculate';
import { useNavigate } from 'react-router-dom';
const Subhome = () => {

  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [electionDone, setElectionDone] = useState([]);
  const [totalVotes, setTotalVotes] = useState(null)
  const [winner, setWinner] = useState('none')
  const [candidate, setCandidate] = useState("");
  const [hasActivePositions, setHasActivePositions] = useState(false); // add new state variable
  const  user = JSON.parse(localStorage.getItem('user'));


  const navigate = useNavigate();
  useEffect(() => {
   
    setLoading(true)
    axios.get('http://localhost:5000/api/v1/election')
      .then(response => {
        setElections(response.data.election);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });

    axios.get('http://localhost:5000/api/v1/vote')
      .then(response => {
        // console.log(response.data)
        setTotalVotes(response.data)
        // console.log(totalVotes)

      })
      .catch(error => {
        console.log(error)
      })

  }, [])



  useEffect(() => {
    if (elections) {
      const liveElections = elections.filter(election => {
        const now = new Date().getTime();
        const endTime = new Date(election.end_time).getTime() - now;
        if (endTime < 0) {
          return setElectionDone(prevElection => [...prevElection, election]);
        }
        else {
          setHasActivePositions(true); // set to true if there is at least one active position
        }
      });
    }

  }, [loading])


if(!user){
return  navigate('home')
}
  if (loading) {
    return <h1>Loading...</h1>
  }
  return (

    <>
      <div className='sub-home-cont'>
      <h1>Live positions</h1>
      {console.log(elections)}
      {!hasActivePositions && <div>No live positions right now</div>} 
      {!loading && elections.map((election, index) => {
        const now = new Date().getTime();
        const endTime = new Date(election.end_time).getTime() - now;
        let timeLeft;
        if (endTime < 0) {
          timeLeft = "closed";
          return null;
        } else if (endTime >= 24 * 60 * 60 * 1000) {
          const days = Math.ceil(endTime / (24 * 60 * 60 * 1000));
          timeLeft = `Ends in: ${days} day${days > 1 ? 's' : ''}`;
        } else if (endTime >= 60 * 60 * 1000) {
          const hours = Math.ceil(endTime / (60 * 60 * 1000));
          timeLeft = `Ends in: ${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
          const minutes = Math.ceil(endTime / (60 * 1000));
          timeLeft = `Ends in: ${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        return (
          <DisplayElection election={election} hoursLeft={timeLeft} key={index} />
        );
      })}
      {electionDone.length > 0 && (
        <>
          <h1>Done Positions</h1>
          {electionDone.map((election, index) => {
            return (
              <Calculate electionDone={election} totalVotes={totalVotes} key={index} />
            )

          })}


        </>
      )}
      </div>
    
    </>

  )
}

export default Subhome