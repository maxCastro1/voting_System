import React from 'react'
import './landingPage.css'

const LandingPage = () => {
  return (
    <div className='landing-cont'>
         <div className='landing-cont-left'>
            <div className='landing-title'>Welcome to Kigali Bilingual Church - Connecting People to God</div>
            <div className='landing-sub-title'>A Place of Worship for Everyone in Kigali, join us today by loging in or sign up </div>
            <div className='landing-btn-cont'>
              <a href='/login' className='landing-button'>sign in</a>
              <a href='/register' className='landing-button'>sign up</a>
            </div>
            <p className='landing-quote'>"Love one another. As I have loved you, so you must love one another." - John 13:34</p>
         </div>
      
      </div>
  )
}

export default LandingPage