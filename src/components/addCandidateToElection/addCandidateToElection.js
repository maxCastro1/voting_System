
import React, { useState, useEffect } from 'react';
import './addCandidateToElection.css'
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import { VscError } from 'react-icons/vsc';
import LoadingSpinner from '../Loader/Loader';
const AddCandidateToElection = () => {

  const [candidateId, setCandidateId] = useState('');
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [electionId, setElectionId] = useState('');
  const [electionOptions, setElectionOptions] = useState([]);
  const [candidates ,setCandidates ] = useState([]);
  const [elections ,setElections] = useState([]);
 const [error , setError] = useState("");
 const [notificationMessage, setNotificationMessage] = useState(null);
 const [message, setMessage] = useState(null);

  const [loading,setLoading] = useState(false);

   useEffect(()=>{
 
    setTimeout(() => {
      setMessage(null)
    }, 2000);
   },[message])
  useEffect(() => {
    // Check if there is a message in local storage
    const message = localStorage.getItem('message');
    if (message) {
       setNotificationMessage(message);
      console.log('Message:', message);
      setTimeout(() => {
        setNotificationMessage(null)
        localStorage.removeItem('message');
      }, 2000);
     
    }
  }, []);
  useEffect(() => {
    // Convert the candidates array to an array of <option> elements
    axios.get('http://localhost:5000/api/v1/candidate/')
  .then(response => {
    console.log(response.data);
    setCandidates(response.data.candidates)
  })
  .catch(error => {
    console.log(error);
  });
    axios.get('http://localhost:5000/api/v1/election/')
  .then(response => {
    console.log(response.data);
    setElections(response.data.elections)
  })
  .catch(error => {
    console.log(error);
  });

  }, []);
  useEffect(() => {
    // Convert the candidates array to an array of <option> elements
    const options = candidates.map((candidate, index) => (
      <option key={index} value={candidate._id}>
        {candidate.first_name} {candidate.last_name}
      </option>
    ));
    setCandidateOptions(options);
    const election = elections.map((elect, index) => (
      <option key={index} value={elect._id}>
        {elect.name}
      </option>
    ));
    setElectionOptions(election)
  }, [candidates,elections]);

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    if (!electionId || !candidateId) {
      setError("Please select an election and a candidate."); // Show an error message
      setLoading(false)
      return; // Return early if validation fails
    }
    console.log(candidateId);
    console.log(electionId);
    axios.post(`http://localhost:5000/api/v1/election/addCandidate/${electionId}`, 
    { candidate_id: candidateId })
  .then(response => {
    console.log(response.data);
     setCandidateId("");
     setElectionId("");
     setError("");
     setMessage("Candidate added")
     setLoading(false);
    
  })
  .catch(error => {
    console.log(error);
    setLoading(false);
    setMessage("")
    setError("something went wrong please try again")
  });

    // await onSubmit(electionId, candidateId); /addCandidate/:id'
  };

  return (
    <div className='cont'>
        {notificationMessage &&
     <div className='notification'>
         <div className='notication-message'>{notificationMessage}</div>
      </div> }
      <h1>Add Candidate to position</h1>
    <div className='form-cont'>
    <form onSubmit={handleSubmit}>
    {error && <div id='error'><VscError/>{error}</div>}
    {message && <div className='success-msg'>{message}</div>}
      <div className='form-cont-div'>
      <label htmlFor="candidateId">Select a postion:</label>
      <select id="electionId" value={electionId} onChange={(event) => setElectionId(event.target.value)} disabled={loading}>
        <option value="">-- Select --</option>
        {electionOptions}
      </select>
      {/* <button type="submit">Add Candidate</button> */}
      </div>
      <div className='form-cont-div'>
      <label htmlFor="candidateId">Select a candidate:</label>
      <select id="candidateId" value={candidateId} onChange={(event) => setCandidateId(event.target.value)} disabled={loading}>
        <option value="">-- Select --</option>
        {candidateOptions}
      </select>
      </div>
      <button type="submit" disabled={loading} >{loading ? <LoadingSpinner/> : "Add Candidate"}</button>
     
    </form>
      </div>
      </div>

   
  )
}

export default AddCandidateToElection