import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../Loader/Loader';
const Search = () => {
    const { searchValue } = useParams();
    const [searchInput, setSearchInput] = useState('');
    const [searchData, setSearchData] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        // Set the value from the URL parameter to the search input state
        setSearchInput(searchValue);

        axios.post('http://localhost:5000/api/v1/user/search',{
            searchTerm : searchValue,
        }).then(response=>{
            console.log(response.data)
            setSearchData(response.data)
            setLoading(false)
        })
        .catch((error)=>{
            setError(true)
            console.log(error)
            setLoading(false)
        })
      }, [searchValue]);

if(loading){
    return <LoadingSpinner width="50px" height="50px" border="3px solid #f3f3f3" borderTop="3px solid #0F5298" padding='2rem'/>
}
if(error){
 return <h1>Something went wrong, please try again.</h1>
}
   

  return (
    <div className='sub-home-cont search-cont'>
        {/* {searchData.candidates.length > 0 && <>
            <h1>Results from candidates</h1>
            { searchData.candidates.map((candidate,index)=>{
                return(
                    <div className='candidates-cont' key={index}>
                    <img src={candidate?.picture} alt="candidate" />
                    <div className='candidates-cont-right'>
                      <h2>{candidate.first_name} {candidate.last_name}</h2>
                      <h4>{`Total Votes : ${candidate.votes.length}`}</h4>
                    </div>
                  </div>
                )
            })} 
           
        </>
           
        } */}
          { searchData.elections.length > 0 && <>
            <h1>Results from Positions</h1>
          {  searchData.elections.map((election,index)=>{
             const now = new Date().getTime();
             const endTime = new Date(election.end_time).getTime() - now;
             let hoursLeft;
             if (endTime < 0) {
                 hoursLeft = "closed";
             } else if (endTime >= 24 * 60 * 60 * 1000) {
                 const days = Math.ceil(endTime / (24 * 60 * 60 * 1000));
                 hoursLeft = `Ends in: ${days} day${days > 1 ? 's' : ''}`;
             } else {
                 const hours = Math.ceil(endTime / (1000 * 60 * 60));
                 hoursLeft = `End in: ${hours} hour${hours > 1 ? 's' : ''}`;
             }

                return(
                    <div className='elections-cont' key={index} >
                    <div className='elections-cont-title'>
                        <h2>Post : {election.name}</h2>
                        <h2>{hoursLeft}</h2>
                    </div>
                    <h5>Description</h5>
                    <p>{election.description}</p>
                </div>
                )
            })}
          </>
            }

            {
                searchData.users.length > 0 && <>
                <h1>Results from Users</h1>
                { searchData.users.map((user,index)=>{
                return(
                    <div className='candidates-cont extra-user-2' key={index}>
                    <img src={user.picture} alt="candidate" />
                    <div className='candidates-cont-right'>
                        <h2>Name: {user.first_name} {user.last_name}</h2>
                        <h2>Email: {user.email} </h2>
                        <h2>NationalId: {user.nationalId} </h2>
                        <h2>Age: {user.age} </h2>
                        
                    </div>

                </div>
                )
            })}
                </>
            }

            {  searchData.users.length < 1 && searchData.elections.length < 1  && 
            <h1>{`No results for ${searchInput}`} </h1>
            }


    </div>
  )
}

export default Search