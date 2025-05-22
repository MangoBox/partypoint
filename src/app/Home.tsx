"use client";
import { useState, useEffect } from "react";
import { VoteInfo } from "./types";
import { v4 } from "uuid";
import { PresentationInfo } from "./types";

function getMachineId() {
    let machineId = localStorage.getItem('MachineId');
    if (!machineId) {
        machineId = v4();
        localStorage.setItem('MachineId', machineId as string);
    }
    return machineId;
}


interface HomeProps {
  sendVote : (voteInfo : VoteInfo) => void;
  getPresentation : () => Promise<PresentationInfo>;
  points : number[]
}


function loadSetPoints() {
  var setPoints = localStorage.getItem("setPoints");
  if (!setPoints) {
    return [];
  }
  return setPoints.split(',').map(Number);
}

function updateUsedPoints(points : number[]) {
  localStorage.setItem("setPoints", points.toString());
}

export default function Home(
  {
    sendVote,
    getPresentation,
    points
  } : HomeProps
) {
 
  const [usedPoints, setUsedPoints] = useState([] as number[]);
  const [presentation, setPresentation] = useState(null as PresentationInfo | null);
  const [confirmDialog, setConfirmDialog] = useState(0);

  useEffect(() => {
    setUsedPoints(loadSetPoints())
  }, [])

  useEffect(() => {
    const fetchPres = async () => {
      const pres = await getPresentation();
      console.log(pres)
      setPresentation(pres);
    }
    fetchPres();
    const interval = setInterval(() => {
      fetchPres();
    }, 5000);
    return () => clearInterval(interval); 
  }, []);


  function voteButton (points : number) {
    sendVote({score: points, voter_id : getMachineId()});
    var temp_usedPoints = [...usedPoints];
    temp_usedPoints.push(points);
    updateUsedPoints(temp_usedPoints);
    setUsedPoints(temp_usedPoints);
    setConfirmDialog(0);
  }

  return (
    <>
    {
      confirmDialog ? 
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Are you sure you want to give {confirmDialog} points?</p>
          </header>
          <footer className="modal-card-foot">
            <div className="buttons">
              <button className="button" onClick={() => setConfirmDialog(0)}>nope</button>
              <button className="button is-success" onClick={() => voteButton(confirmDialog)}>yep</button>
            </div>
          </footer>
        </div>
      </div>
      : <></>
    }
    {
    presentation ?
      <div className="container content has-text-centered">
        <div className="box is-size-4">
          ⭐ Special Interest Presentations ⭐
        </div>
        <div className="section">
          <div className="columns is-centered">
            <div className="column">
              <figure className="image is-128x128 centered is-inline-block">
                <img src={presentation?.pfp}/>
              </figure>
              <h1 className="title"> {presentation?.title} </h1>
              <p className="is-size-5">by {presentation?.creator}</p>
              <div className="box">
                <p className="is-size-5">✏️ Select Score</p>
                {
                  points.map((score) => {
                    return (
                      usedPoints.find((element) => element == score) ?
                        <div key={score}>
                          <button className="button center is-large" disabled> {score} Points </button>
                        </div>
                      :
                        <div key={score}>
                          <button className="button center is-large" onClick={() => {setConfirmDialog(score)}}> {score} Points </button>
                        </div>)
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
       : 
      <div className="container content has-text-centered">
        <div className="box is-size-4">
          ⭐ Special Interest Presentations ⭐
        </div>
        <div className="section">
          <div className="columns is-centered">
            <div className="column">
              <h2>
                The next presentation will be starting soon!
              </h2>
              <figure className="image is-128x128 centered is-inline-block">
                  <img src="https://media.tenor.com/NFO5znOGUzwAAAAM/black-kid-black.gif"/>
                  
              </figure>
            </div>
          </div>
        </div>
      </div>
      }
    </>
  )

}
