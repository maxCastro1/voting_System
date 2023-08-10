import React ,{useState, useEffect} from 'react'
import Candidate from '../candidateView/Candidate';
import axios from 'axios';
import {HiBadgeCheck} from "react-icons/hi";

const ElectionPending = ({election}) => {
return(
    <div className='elections-cont' >
    <div className='elections-cont-title'>
        <h2>Position : <u>{election.name}</u></h2>
    </div>
    <p className='two-winners-paragraph'>Election Pending. </p>
  
</div>
)
   
}
export default ElectionPending