import React, { useState, useEffect } from 'react'
import Candidate from '../candidateView/Candidate'
import axios from 'axios';
import DisplayElection from '../displayElection/displayElection';
import Winner from '../displayElectionWInner/winner';
import { useNavigate } from 'react-router-dom';
import useTimer from '../../hook/Timer';
import LoadingSpinner from '../Loader/Loader';
import WinnersAdministative from '../WinnersAdministative/WinnersAdministative';
import ElectionPending from '../pendingElection/electionPending';
const Subhome = () => {

  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [electionDone, setElectionDone] = useState([]);
  const [totalVotes, setTotalVotes] = useState(null);
  const [addAdministrativeElection, setAdministrativeElection] = useState([])
  const [winner, setWinner] = useState('none')
  const [candidate, setCandidate] = useState("");
  const [activeElections, setActiveElections] = useState([]);
  const [hasActivePositions, setHasActivePositions] = useState(false); // add new state variable
  const  user = JSON.parse(localStorage.getItem('user'));

const [endId, setEndId] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:5000/api/v1/election')
      .then(response => {
        setElections(response.data.elections);
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
    if(endId){
      axios.post(`http://localhost:5000/api/v1/election/${endId}`)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
    }

  }, [endId]);

  const TimerComponent = ({ endTime, electionID }) => {
    const { days, hours, minutes, seconds } = useTimer(endTime);
  
    let hoursLeft;
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      hoursLeft = "closed";
      setEndId(electionID);

    } else if (days > 0) {
      let hour = hours === 0  ? '' : hours 
      hoursLeft = `Ends in: ${days} day${days > 1 ? "s" : ""} ${hour} ${hours !== 0 ? "hr" : ""}`;
    } else if (hours > 0) {
      hoursLeft = `Ends in: ${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""}`;
    }
    else if (minutes > 0 ){
      hoursLeft = `Ends in: ${minutes} min : ${seconds} secs`;
    }
    else{
      hoursLeft = `Ends in :${minutes} min${minutes > 1 ? "s" : ""} ${seconds} sec${seconds > 1 ? "s" : ""}`;
    }
    return hoursLeft;
  };


  useEffect(() => {
    if (elections) {
      const now = new Date().getTime();
      const liveElections = [];
      const administrativeElections = [];
      const doneElections = []
  
      elections.forEach((election) => {
        const endTime = new Date(election.end_time).getTime();
        if (endTime < now && !election.finished) {
          console.log(election.finished)
          setEndId(election._id);
          doneElections.push(election);
        }
        else if (election.typeAdministrative === true ) {
          administrativeElections.push(election);
        }
         else if (election.finished){
           doneElections.push(election);
        }
     
        else {
          liveElections.push(election);
        }
      });
  
      setElectionDone(doneElections);
      setActiveElections(liveElections);
      setAdministrativeElection(administrativeElections);
      setHasActivePositions(liveElections.length > 0); // set to true if there is at least one active position
    }
  }, [elections]);
  


if(!user){
return  navigate('home')
}
  if (loading) {
    return  <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #383636" padding='2rem'/>
  }
  return (

    <>
      <div className='sub-home-cont'>
      <h1>Live positions</h1>
      {!hasActivePositions && <div>No live positions right now</div>} 
      {!loading && activeElections.map((election, index) => {
        const timeLeft = <TimerComponent endTime={election.end_time} electionID={election.id}/>
        return (
          <DisplayElection election={election} hoursLeft={timeLeft} key={index} />
        );
      })}
      {addAdministrativeElection.length > 0 && (
        <>
        <h1>The Community Positions </h1>
        {addAdministrativeElection.map((election,index)=>{
           const timeLeft = <TimerComponent endTime={election.end_time} electionID={election.id}/>
           return(
            !election.finished ? <DisplayElection election={election} hoursLeft={timeLeft} key={index} /> : <WinnersAdministative election={election} key={index}/>
           
           )
        })}
      
        
        </>
      )}
      {electionDone.length > 0 && (
        <>
          <h1>Done Positions</h1>
          {electionDone.map((election, index) => {
            return (
              !election.pending[0]?.answer ? <Winner election={election} key={index} /> : <ElectionPending election={election} key={index}/> 
            )
          })}
        </>
      )}
      </div>
    
    </>

  )
}

export default Subhome