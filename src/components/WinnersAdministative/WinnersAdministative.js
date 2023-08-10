import React, { useState, useEffect } from 'react';
import Winner from '../displayElectionWInner/winner';
import LoadingSpinner from '../Loader/Loader';
import { BiRightArrowCircle } from 'react-icons/bi';
import  axios  from 'axios';
import './winnersAdministative.css'
import Comments from '../comments/Comments';


const WinnersAdministative =  ({ election }) => {
 
  const [candidate, setCandidates] = useState("");
  const [loading, setLoading] = useState(true);
  const [winnerCandidate, setWinnerCandidate] = useState([]);
  const [users, setUser] =  useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const candidateId = JSON.parse(localStorage.getItem('Candidate'));

  
  useEffect(() => {
      setLoading(true)
      axios.get('http://localhost:5000/api/v1/candidate/')
          .then(response => {
              // console.log(response.data);
              setCandidates(response.data.candidates);
              setLoading(false);
          })
          .catch(error => {
              console.log(error);
              setLoading(false);
          });
      axios.get('http://localhost:5000/api/v1/user')
          .then(response => {
              // console.log(response.data);
              setUser(response.data.users);
             
          })
          .catch(error => {
              console.log(error);
              setLoading(false);
          });
  }, [])


  // Filter the candidates array to find the candidate with the same ID as the winner
  useEffect(() => {
    if (candidate && election.winners && election.winners.length > 0) {
      const winnerCandidates = election.winners.map((winnerId) =>
        candidate.find((c) => c._id === winnerId)
      );
      setWinnerCandidate(winnerCandidates);
      
    }
  }, [election, candidate]);
  if (loading) {
      return  <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #383636" padding='2rem'/>
  }
  if (election.failed){
      return (
          <div className='elections-cont' >
          <div className='elections-cont-title'>
              <h2>Position : <u>{election.name}</u></h2>
          </div>
          <p className='two-winners-paragraph'>No winner , two candidate had the same amount of votes</p>
          { (user.admin || candidateId.admin) && <a href='create/election' className='redirect-link'>Please create another position <BiRightArrowCircle /></a>}
      </div>
      )
  }

  

  return (
      <div className='elections-cont' >
          <div className='elections-cont-title'>
              <h2>Position : <u>{election.name}</u></h2>
          </div>
          <p>{`For the community here are the winners`}</p>
          <p></p>
          <div className='elections-cont-body'>
              <div className='candidate-cont extra grid'>
                {winnerCandidate.map((winner,index)=>{
                    const user = users.find(user => user._id === winner.userId);
                   return (
                    <div className='cont-upper winner-grid' key={index}>
                    <img src={user?.picture} alt='pic' className='grid-pic' />
                    <div className='grid-cont'>
                        <p className='winner-name administritive-name'>
                            {user?.first_name} {user?.last_name}
                        </p>
                        {/* <p id='description'>Description: {winner?.description}</p> */}
                    </div>
                </div>
                   )
                })}
                
              </div>
             
              <Comments election={election}/>
          </div>
      </div>
  )
}


export default WinnersAdministative;
