import React, { useState,useEffect } from 'react';
import './login.css'
import { VscError } from "react-icons/vsc";
import {useNavigate } from 'react-router-dom';
import axios from 'axios'
import LoadingSpinner from '../../components/Loader/Loader';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
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
  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      // If successful, response.data will contain the user and token.
      console.log(response.data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('Candidate', JSON.stringify(response.data.candidate));
      navigate("/");
      setLoading(false)
   
    } catch (error) {
      console.error(error.message);
      setLoading(false);
      setError("Email or password not correct");
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if(username === "" || password === ""){
      setError("please fill all fields");
      return console.log("please fill all fields")
    }
    console.log("clicked")
    handleLogin(username,password)

     
  }
  return (
    <div className='cont'>
      {notificationMessage &&
     <div className='notification'>
         <div className='notication-message'>{notificationMessage}</div>
      </div> }
      <div className='login-form-container'>
        <p className='title'>Login</p>
        <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' className='profile-icon' />
        {error && <p id='error'><VscError/> {error} </p>}
        <form onSubmit={handleSubmit}>
          <div className='form-fields'>
            <label htmlFor="username">Email</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}  disabled={loading}/>
          </div>
          <div className='form-fields'>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}  disabled={loading}/>
          </div>
          <div className='button-cont'>
          <button type="submit" disabled={loading}>{loading ? <LoadingSpinner/> : "Login"}</button>
            <a href='/register' className='link-paragraph'>Dont have an account? <u>REGISTER</u></a>
         </div>
     
        
        </form>
      </div>
    </div>
  )
}

export default Login