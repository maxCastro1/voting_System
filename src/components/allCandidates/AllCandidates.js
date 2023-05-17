import React, { useState, useEffect } from 'react'
import './AllCandidates.css'
import axios from 'axios';
import { Buffer } from 'buffer';
import { AiFillDelete } from "react-icons/ai";
import { VscError } from 'react-icons/vsc';
import { IoMdClose } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import {useNavigate } from 'react-router-dom';


const AllCandidates = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [candidates, setCandidates] = useState("");
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [errors, setErrors] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentId, setCurentId] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const navigate = useNavigate();
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
    axios.get('http://localhost:5000/api/v1/candidate/')
      .then(response => {
        console.log(response.data)
        setCandidates(response.data.candidates)
        setLoading(false)
      })
      .catch(error => {
        console.log(error);
        setLoading(false)
      });
  }, [])
 if(!user){
  return navigate('/login')
 }
  const update = (id) => {
    const newErrors = [];
    if (description && description.length < 7) newErrors.push("Description cannot be empty");
    setErrors(newErrors);

    if (newErrors.length === 0) {
      setLoading(true);
      axios.post(`http://localhost:5000/api/v1/candidate/update/${currentId}`, {
        first_name: firstName,
        last_name: lastName,
        email,
        description,
      })

        .then(response => {
          console.log(response.data);
          setFirstName("");
          setLastName("");
          setEmail("");
          setDescription("");
          setPicture(null);
          setErrors([]);
          setLoading(false)
          setCurentId('')
          localStorage.setItem('message', 'Candidate updated successful!');
          window.location.reload()
          setOpenUpdate(false)

        }).catch(error => {
          console.error(error);
          console.log("error");
          setErrors(["something went wrong , please try again"])
          setLoading(false)
        });
    };

  };

  const deleteCandidate = (id) => {
    axios.post(`http://localhost:5000/api/v1/candidate/delete/${id}`)
      .then(response => {
        localStorage.setItem('message', 'Candidate deleted successful!');
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  }

  if (loading) {
    return <h1>Loading...</h1>
  }
  return (
    <div className='candidates-holdong-cont'>
            {notificationMessage &&
     <div className='notification'>
         <div className='notication-message'>{notificationMessage}</div>
      </div> }
      <h1>All Candidate Runing </h1>
      {candidates.map((candidate, index) => {
        return (
          <div className='all-candidates-cont' key={index}>
            {openUpdate && <div className='edit-cont'>
            <button onClick={()=>setOpenUpdate(false)} className='closing-button'><IoMdClose/></button>
              <div className='login-form-container'>
                <p className='title'>Update Candidate</p>
                <h4 className='sub-title'>Edit only fields you need</h4>
                
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    update(candidate._id, firstName, lastName, email, description);
                  }}
                >
                  {errors.length > 0 && (
                    <ul>
                      {errors.map((error, index) => (
                        <li key={index} id="error"><VscError />{error}</li>
                      ))}
                    </ul>
                  )}
                  <div className="form-fields">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-fields">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-fields">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-fields">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="button-cont">
                    <button type="submit" disabled={loading} >{loading ? "Loading..." : "Update"}</button>
                  </div>
                </form>
              </div>
            </div>}
            <div className='candidates-cont'>
              <img src={candidate?.picture} alt="candidate-photo" />
              <div className='candidates-cont-right'>
                <h2>{candidate.first_name} {candidate.last_name}</h2>
                <h4>{`Total Votes : ${candidate.votes.length}`}</h4>
                <div className='buttons-cont'>
                  {user.admin ? <button onClick={() => { deleteCandidate(candidate._id) }}>Delete<AiFillDelete /></button> : <p>Description: {candidate.description}</p>}
                  {user.admin && <button id='green-buttons'onClick={() => { setOpenUpdate(true) ; setCurentId(candidate._id) }}>update<FiEdit/></button>}
                </div>
              </div>
            </div>
          </div>
        )
      })}

    </div>
  )
}

export default AllCandidates