"use server";

//const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
import { neon } from '@neondatabase/serverless';
import Home from './Home';
import { VoteInfo } from './types';

export default async function Page() {
  async function vote(voteInfo : VoteInfo) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO votes (voter, presentation, points) VALUES (${voteInfo.voter_id}, ${"example"}, ${voteInfo.score})`;
  }
  
  async function getPointArray() {
    const numPres = 12;
    const roundNum = 5;
    var pointArray = [] as number[];
    for(var i = 0; i <= Math.ceil(numPres / roundNum) * roundNum; i++) {
      pointArray.push(10 + i);
    }
    return pointArray.reverse();
  }

  return (
    <Home
      sendVote={vote}
      points={await getPointArray()}
    />
  );
}
