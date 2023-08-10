import React, { useState } from 'react';
import './register.css'
import '../login/login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { VscError } from "react-icons/vsc";
import LoadingSpinner from '../../components/Loader/Loader';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [Phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [cell, setCell] = useState('');
    const [picture, setPicture] = useState(null);
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!firstName || !lastName || !password || !confirmPassword  || !email || !cell ) {
        return setError('Please fill out all fields');
        
      } else if (password !== confirmPassword) {
        return setError('Passwords do not match');
      } 
      else if (age < 18){
       return  setError('you must be 18 to create an account');
      }
       else {
        setLoading(true)
        const reader = new FileReader();
        reader.readAsDataURL(picture);
        console.log(reader)
        reader.onloadend = () => {
          const base64Image = reader.result;
          axios.post('http://localhost:5000/api/v1/auth/register', {
            first_name : firstName,
            last_name: lastName,
            email,
            password,
            picture: base64Image,
            Phone,
            cell
       
        }).then(response => {
            console.log(response.data);
            localStorage.setItem('message', 'Registration successful!');
            navigate("/login")
            setLoading(false)
          }).catch(error => {
            console.error(error);
            setError("Something went wrong , please try again")
            setLoading(false)
            // handle registration error here
          });
        };
 
      }
    };

  return (   
  <div className='cont'>
  <div className='login-form-container'>
    <p className='title'>Register</p>
    <form onSubmit={handleSubmit}>
      <div className='form-fields'>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="lastName">Email</label>
        <input type="email" id="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}disabled={loading} />
      </div>
      <div className='form-fields'>
        <label htmlFor="nationalId">Phone</label>
        <input type="text" id="nationalId" value={Phone} onChange={(e) => setPhone(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="nationalId">Cell</label>
        <input type="text" id="nationalId" value={cell} onChange={(e) => setCell(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="age">Age</label>
        <input  type="number" min="0" id="age" value={age} onChange={(e) => setAge(e.target.value)} disabled={loading}/>
      </div>
      <div className='form-fields'>
        <label htmlFor="picture">Picture</label>
        <input type="file" id="picture" onChange={(e) => setPicture(e.target.files[0])} disabled={loading}/>
      </div>
      {error && <div id="error"><VscError/>{error}</div>}
      <div className='button-cont'>
      <button type="submit" disabled={loading}>{loading ? <LoadingSpinner/> : "Register"}</button>
      <a href='/login' className='link-paragraph'>Already have any account? <u>LOGIN</u></a>
      </div>
     
    </form>
  </div>
</div>
  )
}

export default Register