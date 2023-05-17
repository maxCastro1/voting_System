import React, { useState, useEffect } from 'react'
import Candidate from '../candidateView/Candidate'
import axios from 'axios';
import DisplayElection from '../displayElection/displayElection';
import { AiFillDelete } from "react-icons/ai";
import { VscError } from 'react-icons/vsc';
import { IoMdClose } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
const AllVotes = () => {

    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [delected, setDeleted] = useState(false);
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
                setElections(response.data.election);
                console.log(elections)
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
        return <h1>Loading...</h1>
    }
    const deleteElection = (electionId) => {
        axios.post(`http://localhost:5000/api/v1/election/delete/${electionId}`)
            .then(response => {
              localStorage.setItem('message', 'Position deleted successful!');
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }
    return (

         <div className='sub-home-cont'>
             {notificationMessage &&
     <div className='notification'>
         <div className='notication-message'>{notificationMessage}</div>
      </div> }
            <h1>Positions</h1>
            {!loading && elections.map((election, index) => {
                const now = new Date().getTime();
                const endTime = new Date(election.end_time).getTime() - now;
                let hoursLeft;
                if (endTime < 0) {
                    hoursLeft = "closed";
                } else if (endTime >= 24 * 60 * 60 * 1000) {
                    const days = Math.ceil(endTime / (24 * 60 * 60 * 1000));
                    hoursLeft = `Ends in: ${days} day${days > 1 ? 's' : ''}`;
                } else {
                    const hours = Math.ceil(endTime / (1000 * 60 * 60));
                    hoursLeft = `End in: ${hours} hour${hours > 1 ? 's' : ''}`;
                }

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
                     <button onClick={()=>setOpenUpdate(false)} className='closing-button'><IoMdClose/></button>
            {errors.length > 0 && (
              <ul>
                {errors.map((error, index) => (
                     <li key={index}id="error"><VscError/>{error}</li>
                ))}
              </ul>
            )}
            <div className="form-fields">
              <label htmlFor="name">Post:</label>
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
                onChange={(event) => setEndTime(event.target.value)}  
                disabled={loading}
              />
            </div>
            <div className="button-cont">
              <button type="submit"  disabled={loading}>{loading ? "Loading..." : "Update"}</button>
            </div>
          </form> </div></div>}
                    <div className='elections-cont' key={index} >
                        <div className='elections-cont-title'>
                            <h2>Post : {election.name}</h2>
                            <h2 id='time'>{hoursLeft}</h2>
                        </div>
                        <div className='elections-cont-body'>
                            <button  onClick={() => { deleteElection(election._id) }}>Delete election<AiFillDelete /></button>
                            <button id='green-buttons' onClick={() => { setOpenUpdate(true) ; setCurentId(election._id) }}>update<FiEdit/></button>
                        </div>
                    </div>
                    </>
                )

            })}

       </div>
     

    )
}

export default AllVotes