import React, { useState, useEffect } from 'react';
import Winner from '../displayElectionWInner/winner';

const Calculate = ({ electionDone, totalVotes }) => {
  const [winner, setWinner] = useState('none');

  useEffect(() => {
    if (electionDone && totalVotes) {
      let maxVotes = 0;
      let winner = null;
      const candidateVotes = {};
    //  if (electionDone.length && electionDone.length > 1){
    //     for (let i = 0; i < 1; i++) {
    //         console.log("ok");
    //         electionDone[i].candidates.forEach(candidate => {
    //           candidateVotes[candidate.candidate] = totalVotes?.filter(
    //             vote =>
    //               vote.candidate._id === candidate.candidate &&
    //               vote.election._id === electionDone[i]._id
    //           ).length;
    //         });
    //       }
    //       console.log(candidateVotes);
    //       for (const candidate_id in candidateVotes) {
    //         if (candidateVotes.hasOwnProperty(candidate_id)) {
    //           if (candidateVotes[candidate_id] > maxVotes) {
    //             maxVotes = candidateVotes[candidate_id];
    //             winner = candidate_id;
    //             console.log(winner);
    //           }
    //         }
    //       }
    //       // Set the winner after all candidate votes have been counted
    //       setWinner(winner);
        
    //  }
     
        for (let i = 0; i < electionDone.candidates.length; i++) {
            electionDone.candidates.forEach(candidate => {
              candidateVotes[candidate.candidate] = totalVotes?.filter(
                vote =>
                  vote.candidate._id === candidate.candidate &&
                  vote.election._id === electionDone._id
              ).length;
            });
          }
          console.log(electionDone.name)
          console.log(candidateVotes)
          for (const candidate_id in candidateVotes) {
            if (candidateVotes.hasOwnProperty(candidate_id)) {
              if (candidateVotes[candidate_id] > maxVotes) {
                maxVotes = candidateVotes[candidate_id];
                winner = candidate_id;
                console.log(winner);
              }
            }
          }
          // Set the winner after all candidate votes have been counted
          setWinner(winner);
        
     
  
      
    }
  }, [electionDone, totalVotes]);
useEffect(()=>{
//  console.log(Object.keys(electionDone).length)
//  console.log(Object.size(electionDone))

},[electionDone])
  return (
    <>
      <Winner winner={winner} election={electionDone} />
    </>
  );
};

export default Calculate;
