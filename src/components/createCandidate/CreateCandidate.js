import React, { useState } from "react";
import '../../pages/login/login.css';
import axios from 'axios'
import { Buffer } from 'buffer';
import {useNavigate } from 'react-router-dom';
import { VscError } from "react-icons/vsc";

const CreateCandidate = () => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading,setLoading] = useState(false);
    const  user = JSON.parse(localStorage.getItem('user'));
    
    if(!user){
        return navigate('home')
     }
    const handleSubmit = (event) => {
        event.preventDefault();

        const newErrors = [];

        if (firstName.length < 3) newErrors.push("First name cannot be empty");
        if (lastName.length < 3) newErrors.push("Last name cannot be empty");
        if (!email)  newErrors.push("Email cannot be empty");
        if (description.length < 7)  newErrors.push("Description cannot be empty");
        if (!picture)  newErrors.push("Picture cannot be empty");
        setErrors(newErrors);

        if (newErrors.length === 0) {
            setLoading(true);
            const reader = new FileReader();
            reader.readAsDataURL(picture);
            reader.onloadend = () => {
              const base64Image = reader.result
              axios.post('http://localhost:5000/api/v1/candidate/create', {
                first_name: firstName,
                last_name: lastName,
                email,
                description,
                picture: base64Image
              })
           
              .then(response => {
                console.log(response.data);
                console.log("success");
                setFirstName("");
                setLastName("");
                setEmail("");
                setDescription("");
                setPicture(null);
                setErrors([]);
                setLoading(false)
                localStorage.setItem('message', 'Candidate created successful!');
                navigate("/add/candidates")
                
              }).catch(error => {
                console.error(error);
                console.log("error");
                setErrors(["something went wrong , please try again"])
                setLoading(false)
              });
            };
        }
    };

    

    return (
        <>
          
            <div className='cont'>
            <h1>New Candidate</h1>
                <div className='login-form-container'>
                    <p className='title'>Create a Candidate</p>
                    <form onSubmit={handleSubmit}>
                        {errors.length > 0 && (
                            <ul>
                                {errors.map((error, index) => (
                                    <li key={index}id="error"><VscError/>{error}</li>
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
                        <div className="form-fields">
                            <label htmlFor="picture">Picture:</label>
                            <input
                                type="file"
                                id="picture"
                                onChange={(event) => setPicture(event.target.files[0])}
                                disabled={loading}
                            />
                        </div>
                        <div className="button-cont">
                            <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    )

}

export default CreateCandidate