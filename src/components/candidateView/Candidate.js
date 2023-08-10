import React, { useEffect, useState } from 'react';
import './candidate.css';
import axios from 'axios';
import LoadingSpinner from '../Loader/Loader';

const Candidate = ({ candidates, election, hasVoted}) => {
  const { candidate } = candidates;
  const [loading, setLoading] = useState(false);
  const [singleCandidate, setSingleCandidate] = useState([]);
  const [totalVotes, setTotalVotes] = useState(null)
  const [loadingVotes, setLoadingVotes] = useState(false)
  const [userObj, setUserObj] = useState(false);
  const [canVote, setCanVote] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const candidateId = JSON.parse(localStorage.getItem('Candidate'));
  const [userLoading, setUserLoading] = useState(true);
  // console.log(hasVoted)
  const canVot = (vote, ele, cand) => {
    // console.log('Vote:', vote);
    // console.log('Election:', ele);
    // console.log('Candidate:', cand);
    console.log(candidateId);
    if (!vote) {
        if (ele.typeAdministrative) {
          // console.log(election.typeAdministrative)
            setCanVote(true);
        } else if (!ele.typeAdministrative)  {
            if(!cand && user.admin){
              setCanVote(true);
            }
            else if (cand.admin){
              setCanVote(true)
            }   
        } else {
            // console.log('Cannot vote 1');
            setCanVote(false);
        }
    } else {
        // console.log('Cannot vote 2');
        setCanVote(false);
    }
};



useEffect(() => {
    // Fetch candidate data
    setLoading(true);
    axios.get(`http://localhost:5000/api/v1/candidate/${candidate}`)
        .then(response => {
            setSingleCandidate(response.data.candidate);
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
        });

    // Fetch total votes
    setLoadingVotes(true);
    axios.get('http://localhost:5000/api/v1/vote')
        .then(response => {
            setTotalVotes(response.data);
            setLoadingVotes(false);
        })
        .catch(error => {
            console.log(error);
            setLoadingVotes(false);
        });
}, [candidate]);
 useEffect( ()=>{
  const fetch = async ()=>{
    setUserLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/user/${singleCandidate.userId}`);  
      setUserObj(response.data);
      setUserLoading(false);
  } catch (error) {
      console.log(error);
      setUserLoading(false);
  }
} 
     if(singleCandidate.userId){
        fetch();
      }
         
 },[singleCandidate, candidate])

 const vote = async () => {
  try {
    setLoadingVotes(true)
      await axios.post(`http://localhost:5000/api/v1/candidate/vote/${candidate}`, {
          userId: user._id,
          electionId: election._id,
      });
      setLoadingVotes(false)
      window.location.reload();
  } catch (error) {
      console.log(error);
      setLoadingVotes(false)
      // You can handle the error, show an error message, or take other actions here
  }
};

  // useEffect(() => {
  //   if (users.length > 0 && singleCandidate.userId) {
  //     const userObj = users.find(user => user._id === singleCandidate.userId);
  //     setUserObj(userObj);
  //   }


  // }, [users, singleCandidate.userId]);

  useEffect(() => {
  
      canVot(hasVoted, election, candidateId);
    
  }, [hasVoted, election,candidateId]);

  if (loading) {
    return  <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #383636" padding='2rem'/>
  }

  return (
    
    <div className='candidate-cont'>
      {userLoading ? <LoadingSpinner/>: (<>
        <div className='cont-upper'>
        <img src={userObj?.picture} alt='pic' className='candidate-pic' />
        <div>
          <p className='winner-name'>
            {/* {console.log(`${userObj?.first_name} can ${canVote} `)} */}
            {/* {console.log(`${userObj?.first_name} has voted ${hasVoted} `)} */}
            {userObj?.first_name} {userObj?.last_name} 
          </p>
          <p id='description'>Description: {singleCandidate?.description}</p>
        </div>
      </div>
      <div className='cont-lower'>
        <h3>
        {!loadingVotes && totalVotes && `Votes : ${totalVotes && totalVotes?.filter(vote => vote?.candidate?._id === singleCandidate._id && vote?.election?._id === election._id).length}`}
        </h3>
        {canVote && <button id='green-buttons' onClick={() => vote()} disabled={loadingVotes}>VOTE</button>}
      </div>
      </>)}
     
    </div>
  );
};

export default Candidate;