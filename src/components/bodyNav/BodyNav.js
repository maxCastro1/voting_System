import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const BodyNav = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const candidate = JSON.parse(localStorage.getItem('Candidate'));
 if (!user){
 return navigate('home');
 }

  return (
    <div>
      <div className="profile-cont">
        <div className="img-cont">
          <img src={user?.picture} className="profile-img" alt='profile-pic' />
        </div>
        <h1 className="welcomimg-text">
          {user ? `Welcome, ${user?.first_name}` : "Welcome"}
        </h1>
      </div>
      <div className="option-cont">
        {(user?.admin || candidate.admin) ? (
          <>
            <NavLink to="/create/election" activeclassname="active">
              Create position
            </NavLink>
            <NavLink to="/create/candidate" activeclassname="active">
              Register candidate
            </NavLink>
            <NavLink to="/candidates" activeclassname="active">
              Candidates
            </NavLink>
            <NavLink to="/election" activeclassname="active">
              positions
            </NavLink>
            <NavLink to="/users" activeclassname="active">
              Users
            </NavLink>
          </>
        ) : <>
      
          <NavLink to="/" activeclassname="active">
            positions
          </NavLink>
          <NavLink to="/candidates" activeclassname="active">
            Candidates
          </NavLink>
        </>

        }

      </div>
    </div>
  )
}

export default BodyNav