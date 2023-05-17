import React, { useEffect, useState } from 'react';
import './candidate.css';
import axios from 'axios';

const Candidate = ({ candidates, electionId, hasVoted  }) => {
  const { candidate } = candidates;
  const [loading, setLoading] = useState(true);
  const [singleCandidate, setSingleCandidate] = useState([]);
  const [totalVotes, setTotalVotes] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/candidate/${candidate}`)
      .then(response => {
        setSingleCandidate(response.data.candidate);
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

  }, []);

  const vote = () => {
    axios
      .post(`http://localhost:5000/api/v1/candidate/vote/${candidate}`, {
        userId: user._id,
        electionId,
      })
      .then(response => {
        console.log(response.data);
        console.log('ok');
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (loading) {
    return <h4>Loading...</h4>;
  }
  return (
    <div className='candidate-cont'>
      <div className='cont-upper'>
        <img src={singleCandidate.picture} alt='pic' className='candidate-pic' />
        <div>
          <p>
            {singleCandidate.first_name} {singleCandidate.last_name}
          </p>
          <p id='description'>Description: {singleCandidate.description}</p>
        </div>
      </div>
      <div className='cont-lower'>
        <h3>
          Votes : {totalVotes && totalVotes?.filter(vote => vote.candidate._id === singleCandidate._id && vote.election._id === electionId).length}
        </h3>
        {hasVoted ? null : <button id='green-buttons' onClick={() => vote()}>VOTE</button>}
      </div>
    </div>
  );
};

export default Candidate;