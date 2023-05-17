import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './winner.css';
import Candidate from '../candidateView/Candidate';
import mongoose from 'mongoose';

import {BiRightArrowCircle} from 'react-icons/bi'

const Winner = ({ winner, election }) => {
 
    const [candidate, setCandidates] = useState("");
    const [loading, setLoading] = useState(true);
    const [winnerCandidate, setWinnerCandidate] = useState(null)
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
    }, [])

 

    // Filter the candidates array to find the candidate with the same ID as the winner
    useEffect(()=>{
      if(winner && candidate){
        const x = candidate.find(c => c._id === winner)
        setWinnerCandidate(x)
      }
    },[winner , candidate])
    if (loading) {
        return <h1>Loading...</h1>
    }
    if (!winner){
        return (
            <div className='elections-cont' >
            <div className='elections-cont-title'>
                <h2>Position : <u>{election.name}</u></h2>
            </div>
            <p className='two-winners-paragraph'>No winner , two candidate had the same amount of votes</p>
            <a href='create/election' className='redirect-link'>Please create another position <BiRightArrowCircle/></a>
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
                    <div className='cont-upper'>
                        <img src={winnerCandidate?.picture} alt='pic' className='candidate-pic' />
                        <div>
                            <p>
                                {winnerCandidate?.first_name} {winnerCandidate?.last_name}
                            </p>
                            <p id='description'>Description: {winnerCandidate?.description}</p>
                        </div>
                    </div>
                </div>
               

            </div>
        </div>
    )
}

export default Winner;
