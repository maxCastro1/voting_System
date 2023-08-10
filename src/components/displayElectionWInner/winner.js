import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './winner.css';
import Candidate from '../candidateView/Candidate';

import { BiRightArrowCircle } from 'react-icons/bi'
import LoadingSpinner from '../Loader/Loader';
import Comments from '../comments/Comments';

const Winner = ({ election }) => {
   
    
    const [candidate, setCandidates] = useState("");
    const [loading, setLoading] = useState(true);
    const [winnerCandidate, setWinnerCandidate] = useState(null);
    const [users, setUsers] = useState('');
    const [userObj, setUserObj] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const candidateId = JSON.parse(localStorage.getItem('Candidate'));


    useEffect(() => {
        setLoading(true);
    
        Promise.all([
            axios.get('http://localhost:5000/api/v1/candidate/'),
            axios.get('http://localhost:5000/api/v1/user/')
        ])
        .then(([candidatesResponse, usersResponse]) => {
            setCandidates(candidatesResponse.data.candidates);
            setUsers(usersResponse.data.users);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);
    



    // Filter the candidates array to find the candidate with the same ID as the winner
    useEffect(() => {
        if (election && users && candidate) {
            const x = candidate.find(c => c._id === election?.winners[0])
            setUserObj(x)
            const winner = users.find(user => user._id === x?.userId)
            setWinnerCandidate(winner)

        }
    }, [election, candidate, users])
    if (loading) {
        return <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #383636" padding='2rem' />
    }
    if (election.failed) {
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
            <p>{`For the Post of ${election.name} the winner is ${winnerCandidate?.first_name} ${winnerCandidate?.last_name}`}</p>
            <p></p>
            <div className='elections-cont-body '>
                <div className='candidate-cont extra'>
                    <div className='cont-upper cont-upper-winner'>
                        <img src={winnerCandidate?.picture} alt='pic' className='candidate-pic done-pic' />
                        <div>
                            <p className='winner-name'>
                                {winnerCandidate?.first_name} {winnerCandidate?.last_name}
                            </p>
                            <p id='description'><u>Description:</u> {userObj?.description}</p>
                        </div>
                    </div>
                </div>


            </div>
            <Comments election={election} />
        </div>
    )
}

export default Winner;
