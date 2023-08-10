import React, { useState,useEffect } from "react";
import '../../pages/login/login.css';
import axios from "axios";
import {Navigate, useNavigate } from 'react-router-dom';
import { VscError } from "react-icons/vsc";
import LoadingSpinner from "../Loader/Loader";
import { allChurchOfficers } from "./postionData";

const CreationElection = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState(false);
  const [Administrative,setAdministrative] = useState(false);
  const[allCandidates , setAllCandidates] = useState([]);
  const [canditatesOptions, setCandidateOptions] = useState("");
  const [selected, setSelected] = useState();
  const [loading,setLoading] = useState(false);
  const [loadingUsers,setLoadingUsers] = useState(true);
  const [users, setUsers] = useState([]);
     const [notificationMessage, setNotificationMessage] = useState(null);
 

  useEffect(() => {
    setLoadingUsers(true)
    // Convert the candidates array to an array of <option> elements
    axios.get('http://localhost:5000/api/v1/candidate/')
  .then(response => {
    setAllCandidates(response.data.candidates)
  
  })
  .catch(error => {
    console.log(error);
  });
  axios.get('http://localhost:5000/api/v1/user/')
  .then(response => {
      console.log(response.data.users);
      setUsers(response.data.users);
      console.log(response.data)
      setLoadingUsers(false);
  })
  .catch(error => {
      console.log(error);
      setLoadingUsers(false);
  });

  }, []);

  useEffect(() => {   
    if (!loadingUsers) {
     
      const options = allCandidates.map((candidate, index) => {
      
        const userObj = users.find(user => user._id === candidate.userId); 
        return (
          <option key={index} value={candidate._id} >
          {userObj.first_name} {userObj.last_name}
        </option>
        )
    
    });
    setCandidateOptions(options);
    }
  }, [allCandidates,users,loadingUsers]);
  useEffect(()=>{
  console.log(allCandidates)

  },[allCandidates])

  const checkHandler = () => {
    setAdministrative(!Administrative)
  }
    const notifie = (message) => {
        if (message) {
            setNotificationMessage(message);
            setTimeout(() => {
                setNotificationMessage(null)
            }, 2000);
        }
    };
  const handleSubmit = (event) => {
    const now = new Date();
    const selectedEndTime = new Date(endTime);
 
    event.preventDefault();
    const newErrors = [];
    console.log(candidates)
    if (name.length < 3 ) newErrors.push("Name cannot be empty");
    if (description.length < 7) newErrors.push("Description cannot be empty");
    if (!endTime || selectedEndTime <= now) newErrors.push('Please select a future date for End Time.'); 
    
    if (candidates.length === 0) newErrors.push("Please select at least one candidate");

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setLoading(true);
      // const candidateIds = candidates.join(",");
      axios.post('http://localhost:5000/api/v1/election/create', {
        name,
        description,
        end_time: endTime,
        candidates,
        type:Administrative
        
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
        notifie("Position created successful!"); 
        navigate('/')
        
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
    const selectedCandidates = [...candidates,];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        const candidateId = options[i].value;
        // Check if the candidate is already in the selectedCandidates array
        if (!selectedCandidates.includes(candidateId)) {
          selectedCandidates.push(candidateId);
          console.log(selectedCandidates)
        }
      }
    }
    setCandidates(selectedCandidates);
    setSelected(selectedCandidates.length > 0 ? options[selectedCandidates.length - 1].textContent : "");
    setMessage(true);
    setTimeout(() => {
      setMessage(false);
    }, 2000);
  };

  return (
    <>
      <div className="cont">
        {notificationMessage &&
          <div className='notification'>
                    <div className='notication-message'>{notificationMessage}</div>
                </div>}
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
              <select
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}  disabled={loading}
              >
                <option value=''>Select a Position</option>
                {allChurchOfficers.categories.map((position,index)=>(
                <option key={index} value={position}>
                  {position}
                </option>
                ))}
              </select>
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
                {loadingUsers ? <option>Loading...</option> : canditatesOptions}
                
              </select>
            </div>
            <div className="form-fields checkbox">
            <label htmlFor="checkbox">Administrative</label> 
            <input type="checkbox" id="checkbox" checked={Administrative}  onChange={checkHandler} className="checkbx"/>   
            </div>

            {message && <div className="success-msg">{`${selected}`} was Selected</div>}
            <div className="button-cont">
              <button type="submit"  disabled={loading}>{loading ? <LoadingSpinner/> : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreationElection;
