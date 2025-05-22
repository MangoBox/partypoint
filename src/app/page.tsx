
//const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
import { neon } from '@neondatabase/serverless';
import Home from './Home';
import { VoteInfo, PresentationInfo } from './types';


export default async function Page() {
  async function getCurrentState() {
    "use server";
    const sql = neon(`${process.env.DATABASE_URL}`);
    var res = await sql`SELECT current_presentation FROM state WHERE state_id = ${1}`;
    return res[0];
  }

  async function getCurrentPresentation() : Promise<PresentationInfo | null> {
    "use server";
    const cur_state = await getCurrentState();
    const sql = neon(`${process.env.DATABASE_URL}`);
    var res = await sql`SELECT (creator, title, pfp, score, link) FROM presentations WHERE presentation = ${cur_state.current_presentation}`;
    if(!res[0] || !res[0].row) {
      return null;
    }
    var elements = res[0].row.slice(1,-1).split(",")
    var pres_info =
      {creator : elements[0].slice(1,-1),
        title: elements[1],
        pfp: elements[2],
        score: elements[3],
        link: elements[4]
      } as PresentationInfo
    return pres_info;
  }


  async function vote(voteInfo : VoteInfo) {
    "use server";
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    // Insert the comment from the form into the Postgres database
    //await sql`INSERT INTO votes (voter, presentation, points) VALUES (${voteInfo.voter_id}, ${"example"}, ${voteInfo.score})`;
    // Get current presentation.
    const cur_state = await getCurrentState();
    await sql`UPDATE presentations SET score = score + ${voteInfo.score} WHERE presentation = ${cur_state.current_presentation}`
  }
  
  async function getPointArray() {
    const numPres = 12;
    const roundNum = 5;
    var pointArray = [] as number[];
    /*for(var i = 0; i <= Math.ceil(numPres / roundNum) * roundNum; i++) {
      pointArray.push(10 + i);
    }*/
    for(var i = 10; i <= 25; i++) {
      pointArray.push(i);
    }
    return pointArray.reverse();
  }

  return (
    <Home
      sendVote={vote}
      points={await getPointArray()}
      getPresentation={getCurrentPresentation}
    />
  );
}
