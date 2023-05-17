import React, { useState } from 'react'
import './home.css'
import Candidate from '../../components/candidateView/Candidate'
import Footer from '../../components/footer/footer'
import Subhome from '../../components/sub-home.js/sub-home'
import CreateCandidate from '../../components/createCandidate/CreateCandidate'
import CreationElection from '../../components/createElection/CreationElection'
import AllCandidates from '../../components/allCandidates/AllCandidates'
import AddCandidateToElection from '../../components/addCandidateToElection/addCandidateToElection'
import BodyNav from '../../components/bodyNav/BodyNav'
import { Outlet, Route,Routes } from 'react-router-dom'
import AllVotes from '../../components/allElection.js/allElection'
import AllUser from '../../components/allUsers/allUser'
import Search from '../../components/search/search'
import LandingPage from '../LandingPage/landingPage'
const Home = ({user}) => {
  return (
    <main>
      <BodyNav user={user}/>
      <Routes>
        <Route path="/" element={<Subhome />} />
        <Route path="home" element={<LandingPage/>}/>
        <Route path="create/candidate" element={<CreateCandidate />} />
        <Route path="create/election" element={<CreationElection />} />
        <Route path="candidates/" element={<AllCandidates />} />
        <Route path="add/candidates" element={<AddCandidateToElection />} />
        <Route path="election/" element={<AllVotes />} />
        <Route path="users/" element={<AllUser />} />
        <Route path="search/:searchValue" element={<Search />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default Home