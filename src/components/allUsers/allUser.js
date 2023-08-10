import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { AiFillDelete } from 'react-icons/ai';
import { VscError } from 'react-icons/vsc';
import { IoMdClose } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import LoadingSpinner from '../Loader/Loader';

const AllUser = () => {

    const [users, setUsers] = useState("");
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate()

    const [candidates, setCandidates] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [errors, setErrors] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [currentId, setCurentId] = useState("");
    const [nationalId, setNationalId] = useState('');
    const [age, setAge] = useState('');
    const [notificationMessage, setNotificationMessage] = useState(null); 


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
        setLoading(true)
        axios.get('http://localhost:5000/api/v1/user/')
            .then(response => {
                console.log(response.data.users);
                setUsers(response.data.users);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    }, [])

    const deleteUser = (id) => {
        axios.post(`http://localhost:5000/api/v1/user/delete/${id}`)
            .then(response => {
                localStorage.setItem('message', 'User deleted successful!');
                setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            })
            .catch(error => {
                console.log(error);
            });
    }
    const update = () => {
        const newErrors = [];
        if (description && description.length < 7) newErrors.push("Description cannot be empty");
        setErrors(newErrors);

        if (newErrors.length === 0) {
            setLoading(true);
            axios.post(`http://localhost:5000/api/v1/user/update/${currentId}`, {
                first_name: firstName,
                last_name: lastName,
                email,
                description,
                age,
                nationalId
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
                    localStorage.setItem('message', 'User updated successful!');
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
    const filterOutAdmins = () => {
        return users.filter((user) => !user.admin);
      };
    if (!user) {
        navigate('/login')
    }
    if (loading) {
        return  <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #383636" padding='2rem'/>
    }

    return (
        <div className='candidates-holdong-cont'>
                {notificationMessage &&
     <div className='notification'>
         <div className='notication-message'>{notificationMessage}</div>
      </div> }
            <h1>All Users </h1>
            {!users && <p>No Users found</p>}
            {users && filterOutAdmins().map((user, index) => {
                return (
                    <div className='all-candidates-cont extra-user' key={index} >
                        {openUpdate && <div className='edit-cont'>
                        <button onClick={()=>setOpenUpdate(false)} className='closing-button'><IoMdClose/></button>
                            <div className='login-form-container'>
                                <p className='title'>Update User </p>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        update(firstName, lastName, email, description, age, nationalId);
                                    }}
                                >
                                    <div className='form-fields'>
                                        <label htmlFor="firstName">First Name</label>
                                        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
                                    </div>
                                    <div className='form-fields'>
                                        <label htmlFor="lastName">Last Name</label>
                                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
                                    </div>
                                    <div className='form-fields'>
                                        <label htmlFor="lastName">Email</label>
                                        <input type="email" id="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                                    </div>

                                    <div className='form-fields'>
                                        <label htmlFor="nationalId">National ID</label>
                                        <input type="text" id="nationalId" value={nationalId} onChange={(e) => setNationalId(e.target.value)} disabled={loading} />
                                    </div>
                                    <div className='form-fields'>
                                        <label htmlFor="age">Age</label>
                                        <input type="number" min="0" id="age" value={age} onChange={(e) => setAge(e.target.value)} disabled={loading} />
                                    </div>
                                    {/* <div className='form-fields'>
                                        <label htmlFor="picture">Picture</label>
                                        <input type="file" id="picture" onChange={(e) => setPicture(e.target.files[0])} disabled={loading} />
                                    </div> */}
                                    {errors.length < 0  && <div id="error"><VscError />{errors}</div>}
                                    <div className='button-cont'>
                                        <button type="submit" disabled={loading}>{loading ? <LoadingSpinner/> : "Update"}</button>
                                        <a href='/login' className='link-paragraph'>Already have any account? <u>LOGIN</u></a>
                                    </div>

                                </form>
                            </div></div>}
                        <div className='candidates-cont extra-user-2'>
                            <img src={user.picture} alt="candidate" />
                            <div className='candidates-cont-right'>
                                <h2>Name: {user.first_name} {user.last_name}</h2>
                                <h2>Email: {user.email} </h2>
                                <div className='elections-cont-body'>
                                <button onClick={() => { deleteUser(user._id) }}>Delete<AiFillDelete /></button>
                                <button id='green-buttons' onClick={() => { setOpenUpdate(true); setCurentId(user._id) }}>update<FiEdit /></button>
                                </div>
                                
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AllUser