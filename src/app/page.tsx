"use client";
import { useState } from "react";

//import postgres from 'postgres';
 
//const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

interface Presentation {
  title : string;
  name : string;
  pfp : string;
}

const pres = {
  title : "Presentation 1",
  name : "John Presentation",
  pfp : "https://community.adobe.com/t5/image/serverpage/image-id/636919i6D8593BB232D17E4?v=v2"
}

function sendVote(score : number) {

}

export default function Home() {
  const boxes = [1, 2, 3].reverse()
  
  const [dialog, setDialog] = useState("");

  const [presentation, setPresentation] = useState(pres as Presentation | null);
  const [confirmDialog, setConfirmDialog] = useState(0);


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
              <button className="button is-success" onClick={() => sendVote(confirmDialog)}>yep</button>
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
              <p className="is-size-5">by {presentation?.name}</p>
              <div className="box">
                <p className="is-size-5">✏️ Select Score</p>
                {
                  boxes.map((box) => {
                    return (
                      <div key={box}>
                        <button className="button center is-large" onClick={() => {setConfirmDialog(box)}}> {box} Points </button>
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
