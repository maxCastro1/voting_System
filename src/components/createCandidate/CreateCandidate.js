import React, { useState, useEffect } from "react";
import '../../pages/login/login.css';
import axios from 'axios';
import { VscError } from "react-icons/vsc";
import LoadingSpinner from "../Loader/Loader";
import { useNavigate } from 'react-router-dom';

const CreateCandidate = () => {
    const [department, setDepartment] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [notificationMessage, setNotificationMessage] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/user");
                const nonAdminUsers = response.data.users.filter((user) => !user.admin);
                setUsers(nonAdminUsers);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchUsers();
    }, []);
    

    if (!user) {
        return navigate('home')
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
        event.preventDefault();
        const newErrors = [];
        if (description.length < 7) newErrors.push("Description cannot be empty");
        setErrors(newErrors);

        if (newErrors.length === 0) {
            setLoading(true);
            axios.post('http://localhost:5000/api/v1/candidate/create', {
                description,
                userId: selectedUserId,
                department
            })
                .then(response => {
                    console.log(response.data);
                    setDepartment("");
                    setDescription("");
                    setErrors([]);
                    setLoading(false)
                    notifie("Candidate created successful!"); 
                    const candidateIds = response.data.candidates.map((candidate) => candidate.userId);
                    setUsers(candidateIds);

                })
                .catch(error => {
                    console.error(error);
                    console.log("error");
                    setErrors(["something went wrong, please try again"])
                    setLoading(false)
                });
        }
    };

    return (
        <div className='cont'>
            {notificationMessage &&
                <div className='notification'>
                    <div className='notication-message'>{notificationMessage}</div>
                </div>}
            <h1>New Candidate</h1>
            <div className='login-form-container'>
                <p className='title'>Create a Candidate</p>
                <form onSubmit={handleSubmit}>
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index} id="error"><VscError />{error}</li>
                            ))}
                        </ul>
                    )}
                    <div className="form-fields">
                        <label htmlFor="user">Select User:</label>
                        <select
                            id="user"
                            value={selectedUserId}
                            onChange={(event) => setSelectedUserId(event.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-fields">
                        <label htmlFor="department">Department:</label>
                        <input
                            id="department"
                            value={department}
                            onChange={(event) => setDepartment(event.target.value)}
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
                        <button type="submit" disabled={loading}>{loading ? <LoadingSpinner /> : "Register"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCandidate;
