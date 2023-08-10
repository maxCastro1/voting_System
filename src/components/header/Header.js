import React, { useEffect, useState } from 'react'
import './header.css'
import { AiOutlineMenu } from "react-icons/ai";
import { GrFormClose } from "react-icons/gr";
import { useNavigate, useLocation } from 'react-router-dom';
import {BsSearch} from 'react-icons/bs'
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [navOpen, setNavOpen] = useState(false);
    const [button, setButton] = useState("");
    const [userProfile, setUserProfile] = useState(false); // Initialize to false
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        (localStorage.getItem('user')) ? setUserProfile(true) : setUserProfile(false)
        setButton(location.pathname === '/login' ? 'Register' : 'Login')
    }, [location])
   console.log(searchValue)
    const handleSearch = (event) => {
        event.preventDefault()
        console.log(searchValue);
        navigate(`search/${searchValue}`)
        setSearchOpen(false)
    }

    const toogleNav = () => {
        setNavOpen(!navOpen)
    }
    const handleLogout = () => {
        if (button === 'Login') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
            }
         else {
          navigate('/register');
        }
      };

    return (

        <header>
            <div className='header-cont'>
                {/* <a href='/'><img src={logo} className ='header-logo' alt="logo"/></a> */}
                <div className='logo'><a href='/'>kigali bilingual church</a></div>
               
                <button onClick={() => toogleNav()} className='button-nav'>
                    {navOpen ? <GrFormClose className='close-btn' /> : <AiOutlineMenu />}
                </button>
              
                <div className={`nav-link ${navOpen ? 'open' : 'closed'}`}>
                    <ul>
                        <li><a href='/notfication' onClick={()=>toogleNav()}>Notice</a></li>
                        {userProfile && <li><button className='logout' onClick={() => {setSearchOpen(!searchOpen) ; setNavOpen(false)}}>Search</button></li>}
                        <li><button onClick={() => {{ handleLogout() ; setNavOpen(false)} }} className='logout'>{userProfile ? "Logout" : button}</button></li>
                    </ul>
                </div>
             
            </div>
            {searchOpen && 
            <div className='search-bar-cont'>
                
                <input type="text"
                    className='search-bar'
                    placeholder='Search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                    {/* <BsSearch className='search-icon'/> */}
         
        <button
          type='submit'
          className='search-button'
          onClick={(event) => { handleSearch(event)}}
        >
          <BsSearch/>
        </button>
            </div>}

        </header>



    )
}

export default Header
