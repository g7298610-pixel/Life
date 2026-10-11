"use client"
import { useState } from 'react'
export default function PlanePUBG(){
  const [mode,setMode]=useState('inside')
  return(
    <div style={{height:'60vh', background:mode==='inside'?'#222':'#87CEEB', padding:20}}>
      <button onClick={()=>setMode(mode==='inside'?'outside':'inside')} style={{padding:15, fontSize:16}}>
        {mode==='inside'?'OUTSIDE VIEW ✈️':'INSIDE VIEW 💺'}
      </button>
      <div style={{marginTop:20}}>
        {mode==='inside'?'INSIDE: Seat 12B - Real passengers, play dice, sleep':'OUTSIDE: PUBG cam over real Earth - Sahara → China'}
      </div>
      <p>Flight 8 mins - Economy R8k - Toggle anytime</p>
    </div>
  )
}
