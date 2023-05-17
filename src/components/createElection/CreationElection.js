import React, { useState,useEffect } from "react";
import '../../pages/login/login.css';
import axios from "axios";
import {useNavigate } from 'react-router-dom';
import { VscError } from "react-icons/vsc";

const CreationElection = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(false);
  const[allCandidates , setAllCandidates] = useState([]);
  const [canditatesOptions, setCandidateOptions] = useState("");
  const [selected, setSelected] = useState();
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    // Convert the candidates array to an array of <option> elements
    axios.get('http://localhost:5000/api/v1/candidate/')
  .then(response => {
    console.log(response.data);
    setAllCandidates(response.data.candidates)
  })
  .catch(error => {
    console.log(error);
  });

  }, []);

  useEffect(() => {   
    if (allCandidates) {
      const options = allCandidates.map((candidate, index) => (
      <option key={index} value={candidate._id}>
        {candidate.first_name} {candidate.last_name}
      </option>
    ));
    setCandidateOptions(options);
    }
  }, [allCandidates]);

  const handleSubmit = (event) => {
    const now = new Date();
    const selectedEndTime = new Date(endTime);
 
    event.preventDefault();
    const newErrors = [];
    if (name.length < 3 ) newErrors.push("Name cannot be empty");
    if (description.length < 7) newErrors.push("Description cannot be empty");
    if (!endTime || selectedEndTime <= now) newErrors.push('Please select a future date for End Time.'); 
    
    if (candidates.length === 0) newErrors.push("Please select at least one candidate");

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setLoading(true);
      const candidateIds = candidates.join(",");
      axios.post('http://localhost:5000/api/v1/election/create', {
        name,
        description,
        end_time: endTime,
        candidates: {
          candidate:candidateIds
        }
    }
   
      ).then(response => {
        console.log(response.data);
        console.log("success");
        setName("")
        setDescription("");
        setEndTime("");
        setCandidates([]);
        setErrors([]);
        setLoading(false)
        localStorage.setItem('message', 'Position created successful!');
        navigate("/candidates/add")
        
      }).catch(error => {
        console.error(error);
        console.log("error")
        setLoading(false)
        setErrors(["something went wrong , please try again"])
        // handle registration error here
      });
    }
  };

  const handleCandidateChange = (event) => {
    const options = event.target.options;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    setSelected(selectedOption.textContent)
    const selectedCandidates = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCandidates.push(options[i].value);
      }
    }
    setCandidates(selectedCandidates);
    setMessage(true)
    setTimeout(() => {
        setMessage(false);
      }, 2000);
  };

  return (
    <>
   
      <div className="cont">
      <h1>New Position</h1>
        <div className="login-form-container">
          <p className="title">create new Position</p>
          <form onSubmit={handleSubmit} id='formm'>
            {errors.length > 0 && (
              <ul>
                {errors.map((error, index) => (
                     <li key={index}id="error"><VscError/>{error}</li>
                ))}
              </ul>
            )}
            <div className="form-fields">
              <label htmlFor="name">Position:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}  disabled={loading}
              />
            </div>
            <div className="form-fields">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}  disabled={loading}
              />
            </div>
            <div className="form-fields">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}  disabled={loading}
              />
            </div>
            <div className="form-fields">
              <label htmlFor="candidates">Candidates:</label>
              <select
                id="candidates"
                multiple
                value={candidates}
                onChange={handleCandidateChange}  disabled={loading}
              >
              {canditatesOptions}
              </select>
            </div>
            {message && <div className="success-msg">{`${selected}`} was Selected</div>}
            <div className="button-cont">
              <button type="submit"  disabled={loading}>{loading ? "Loading..." : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreationElection;
