import React, { useEffect } from 'react'
import { NavLink } from "react-router-dom";
import {useNavigate } from 'react-router-dom';

const BodyNav = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

   if(!user){
    return navigate('home')
    }

    return (
        <div>
        <div className="profile-cont">
          <div className="img-cont">
            <img src={user.picture} className="profile-img" />
          </div>
          <h1 className="welcomimg-text">
            {user ? `Welcome, ${user?.first_name}` : "Welcome"}
          </h1>
        </div>
        <div className="option-cont">
          {user?.admin ? (
            <>
              <NavLink to="/create/election" activeClassName="active">
                Create position
              </NavLink>
              <NavLink to="/create/candidate" activeClassName="active">
                Register candidate
              </NavLink>
              <NavLink to="/add/candidates" activeClassName="active">
                Add candidate to position
              </NavLink>
              <NavLink to="/candidates" activeClassName="active">
                Candidates
              </NavLink>
              <NavLink to="/election" activeClassName="active">
                positions
              </NavLink>
              <NavLink to="/users" activeClassName="active">
                Users
              </NavLink>
            </>
             )   :
                    <>
                          <NavLink to="/" activeClassName="active">
              positions
            </NavLink>
            <NavLink to="/candidates" activeClassName="active">
              Candidates
            </NavLink>
                    </>

                }

            </div>
        </div>
    )
}

export default BodyNav