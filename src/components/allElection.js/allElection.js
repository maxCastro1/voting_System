import React, { useState, useEffect } from 'react'
import Candidate from '../candidateView/Candidate'
import axios from 'axios';
import DisplayElection from '../displayElection/displayElection';
import { AiFillDelete } from "react-icons/ai";
import { VscError } from 'react-icons/vsc';
import { IoMdClose } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import useTimer from '../../hook/Timer';
import LoadingSpinner from '../Loader/Loader';
const AllVotes = () => {

  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [currentId, setCurentId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);


  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:5000/api/v1/election')
      .then(response => {
        setElections(response.data.elections);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }, [])
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
  const TimerComponent = ({ endTime }) => {
    const { days, hours, minutes, seconds } = useTimer(endTime);
  
    let hoursLeft;
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      hoursLeft = "closed";
    } else if (days > 0) {
      hoursLeft = `Ends in: ${days} day${days > 1 ? "s" : ""}, ${hours} hr${hours > 1 ? "s" : ""}, ${minutes} min${minutes > 1 ? "s" : ""}, ${seconds} sec${seconds > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      hoursLeft = `Ends in: ${hours} hr${hours > 1 ? "s" : ""}, ${minutes} min${minutes > 1 ? "s" : ""}, ${seconds} sec${seconds > 1 ? "s" : ""}`;
    }
    else{
      hoursLeft = `Ends in :${minutes} min${minutes > 1 ? "s" : ""}, ${seconds} : ${seconds}`;
    }
    return <h2 id="time">{hoursLeft}</h2>;
  };
  

  const update = () => {
    const newErrors = [];
    if (description && description.length < 7) newErrors.push("Description cannot be empty");
    setErrors(newErrors);

    if (newErrors.length === 0) {
      setLoading(true);
      axios.post(`http://localhost:5000/api/v1/election/update/${currentId}`, {
        name,
        description,
        endTime
      })

        .then(response => {
          console.log(response.data);
          setLoading(false)
          setCurentId('')
          localStorage.setItem('message', 'Position updated successful!');
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

  if (loading) {
    return  <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #383636" padding='2rem'/>
  }
  const deleteElection = (electionId) => {
    setButtonLoading(true)
    axios.post(`http://localhost:5000/api/v1/election/delete/${electionId}`)
      .then(response => {
        localStorage.setItem('message', 'Position deleted successful!');
        setElections(prevElections => prevElections.filter(election => election._id !== electionId));
        setButtonLoading(false)
      })
      .catch(error => {
        console.log(error);
        setButtonLoading(false)
      });
  }

  return (

    <div className='sub-home-cont'>
      {notificationMessage &&
        <div className='notification'>
          <div className='notication-message'>{notificationMessage}</div>
        </div>}
      <h1>Positions</h1>
      {!loading && elections.map((election, index) => {

        return (
          <>
            {openUpdate &&
              <div className='edit-cont' key={index}>
                <div className='login-form-container'>
                  <form id='formm'
                    onSubmit={(event) => {
                      event.preventDefault();
                      update(currentId, name, endTime, description);
                    }}
                  >
                    <button onClick={() => setOpenUpdate(false)} className='closing-button'><IoMdClose /></button>
                    {errors.length > 0 && (
                      <ul>
                        {errors.map((error, index) => (
                          <li key={index} id="error"><VscError />{error}</li>
                        ))}
                      </ul>
                    )}
                    <div className="form-fields">
                      <label htmlFor="name">Post:</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)} disabled={loading}
                      />
                    </div>
                    <div className="form-fields">
                      <label htmlFor="description">Description:</label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)} disabled={loading}
                      />
                    </div>
                    <div className="form-fields">
                      <label htmlFor="endTime">End Time:</label>
                      <input
                        type="datetime-local"
                        id="endTime"
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="button-cont">
                      <button type="submit" disabled={loading}>{loading ? <LoadingSpinner/> : "Update"}</button>
                    </div>
                  </form> </div></div>}
            <div className='elections-cont' key={index} >
              <div className='elections-cont-title'>
                <h2>Post : {election.name}</h2>
                <TimerComponent endTime={election.end_time} />
              </div>
              <div className='elections-cont-body'>
                <button onClick={() => { deleteElection(election._id) }} disabled = {buttonLoading}>Delete election <AiFillDelete/></button>
                <button id='green-buttons' onClick={() => { setOpenUpdate(true); setCurentId(election._id) }} disabled = {buttonLoading} >update<FiEdit /></button>
              </div>
            </div>
          </>
        )

      })}

    </div>


  )
}

export default AllVotes